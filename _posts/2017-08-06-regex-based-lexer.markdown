---
layout: post
title: "Hand-written lexer compared to DFA regex-based ones"
description: |
    Comparison between hand-written, single-regex and multi-regex lexers
    implemented in Rust using DFA regex engine.
date: 2017-08-06
categories:
    - Lexical analysis
    - Compilers
    - Regex
    - Rust
comments: true
---

In [this][eli-regex-blog] blog post by Eli Bendersky, he compared a handwritten
lexical analyzer to regex-based ones, with the former showing significant speed
improvements over the latter (the multi-regex implementation in particular is
over 5.5x slower than the hand-written version).

The lexers found in the blog post are, however, written in Javascript, which uses
a regular expression engine based on the technique of backtracking, commonly
referred as "regexp". The regular expression in the theoretical computer science
sense, on the other hand, is based on Deterministic Finite Automata (DFA). While
they lack the advanced features found in regexps, they often provide better
performance.

With that in mind, I decided to hack together a few lexers in Rust (which happens
to use a DFA based regex library), to find out if the choice of regex engine
matters in lexer construction. I then benchmarked them lexing a 4.2MB (100k lines)
randomly generated source file<sup id="a1">[[1]](#f1)</sup>, using
`Rustc 1.21.0-nightly`<sup id="a2">[[2]](#f2)</sup> with `cargo bench`.

![Lexer benchmarks]({{site.url}}/assets/lexer_bench.png)

The single-regex implementation is over 3.5x slower than the multi-regex version
and well over 50x slower compared to the handwritten lexer! How could this be?
My initial thought was that most of the run time is spent compiling the regex,
but this could not explain why its multi-regex counterpart is still several times
faster. Furthermore, however expensive the cost of regex compilation is, it
shouldn't take more than a few milliseconds.

The time difference between the multi-regex and handwritten version, on the hand,
is quite explainable; Rust itself is a compiled language with an LLVM backend,
which contains an extensive suite of optimizers capable of producing tight and
efficient machine code. The regex engine, however, compiles on the fly - it has
to make a tradeoff between compilation time and execution speed.

<hr class="p-divider">

Here is a part of the single-regex implementation, or you can read the full source
[here][github-repo]. I am still pretty new to the Rust language, so please kindly
notify me if there are any errors or potential improvements to the code.

{% highlight rust %}
static RULES: [(&str, &str); 10] = [("Plus", r"\+"),
                                    ("Minus", r"\-"),
                                    ("Multiply", r"\*"),
                                    ("Divide", r"/"),
                                    ("Equal", r"="),
                                    ("LBracket", r"\("),
                                    ("RBracket", r"\)"),
                                    ("Integer", r"\d+"),
                                    ("Ident", r"\w+"),
                                    ("Quote", "^\"[^\n]*?\"")];

lazy_static! {
    static ref NON_TOKEN: Regex = Regex::new(r"^(\s|\n)+").unwrap();
    static ref RE: Regex = {
        let re_str =
            RULES.iter()
                .fold(String::new(), |acc, &(ref rule, ref re)| {
                    format!("{}(?P<{}>{})|", acc, rule, re)
                });
        Regex::new(&format!("^({}(?P<Comment>//.+$))", re_str)).unwrap()
    };
}

#[derive(Debug, PartialEq)]
struct Lexer<'a> {
    src: &'a str,
    src_len: usize,
}

impl<'a> Lexer<'a> {
    fn new(src: &'a str) -> Lexer {
        let src_len = src.chars().count();
        Lexer { src, src_len }
    }

    fn lex(&self) -> Vec<Token> {
        let mut pointer = 0;
        let mut tokens = vec![];

        while pointer < self.src_len {
            let buf = &self.src[pointer..];

            // Skip to token
            if let Some(mat) = NON_TOKEN.find(buf) {
                pointer += mat.end() - mat.start();
            } else {
                let cap = RE.captures(buf).unwrap();
                if let Some(mat) = cap.name("Comment") {
                    pointer += mat.end() - mat.start();
                } else {
                    for &(ref rule, _) in RULES.iter() {
                        if let Some(mat) = cap.name(rule) {
                            let token_len = mat.end() - mat.start();
                            tokens.push(Token(rule.parse::<Item>().unwrap(),
                                            &self.src[pointer..pointer + token_len],
                                            Span(pointer, pointer + token_len)));
                            pointer += token_len;
                            break;
                        }
                    }
                }
            }
        }

        tokens
    }
}
{% endhighlight %}


<b id="f1">[1]</b> Generated using <a href="https://github.com/tommyip/blog-code/blob/master/regex_based_lexer/codegen.py">codegen.py</a> [↩](#a1)
<br>
<b id="f2">[2]</b> The nightly version of the compiler is required to use unstable features, in which benchmarking is one of them. [↩](#a2)

[eli-regex-blog]: http://eli.thegreenplace.net/2013/07/16/hand-written-lexer-in-javascript-compared-to-the-regex-based-ones
[github-repo]: https://github.com/tommyip/blog-code/tree/master/regex_based_lexer/src
