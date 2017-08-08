---
layout: post
title: "Hand-written lexer compared to regex-based ones with DFA engine"
description: |
    Comparison between hand-written, single-regex and multi-regex lexer
    implemented in Rust.
date: 2017-08-07
categories:
    - Lexical analysis
    - Compilers
    - Regex
    - Rust
---
In [this][eli-regex-blog] blog post by Eli Bendersky, he compared a hand-written
lexer to regex-based ones, with the former showing significant speed improvements
over the latter (the multi-regex implementation in particular is over 5.5x slower
then the hand-written version).

The lexers found in the blog post are, however, written in Javascript, which uses
a regular expression engine based on the technique of backtracking, commonly
refered as "regexp". The regular expression in theoretical computer science
sense, on the other hand, is based on Deterministic Finite Automata (DFA). While
they lack the advanced features found in regexps, they often provide better
performance.

With that in mind I decided to hack together a lexer in Rust, it's regex engine
is inspired with the RE2 library, which uses finite-state machines.

[eli-regex-blog]: http://eli.thegreenplace.net/2013/07/16/hand-written-lexer-in-javascript-compared-to-the-regex-based-ones
