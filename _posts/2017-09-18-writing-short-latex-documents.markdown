---
layout: post
title: "Tips for writing single page LaTeX documents"
description: |
    Thinking of writing short documents in LaTeX? Use these tips & tricks to
    make it look clean and professional.
date: 2017-09-18
categories:
    - LaTeX
comments: true
---

LaTeX is an awesome tool for writing medium-to-large technical or scientific
documents, but what if you just want to write a quick report? Here are some
tips & tricks to do just that.

## Tip #1: Reduce margin size

The default margin size is huge, great for margin notes, but unnecessary for
our use case. You can set the margins using the `geometry` package.

<script src="https://gist.github.com/tommyip/7c3bc66da2d11257472cec72033338db.js"></script>

The sweet spot seems to be 2cm by 2cm. If you want to pack more text, 1.5cm for
the sides can work as well.

<hr class="p-divider">

## Tip #2: Negative space

The `\vspace` marco inserts a set amount of space after the current line, but
you can also use negative numbers to remove excess space. The title by default
has a large top margin, remove that using this trick.

<script src="https://gist.github.com/tommyip/b30ff95fe834de8051c9cfc0154f3170.js"></script>

<hr class="p-divider">

## Tip #3: Multiple columns

Reducing the side margins in Tip #1 make each line span across the whole page,
which doesn't feel quite right to the reader. Two-column documents can be
created using the `\twocolumn` macro, but I would recommend using the
`multicol` package as it provides more flexibility for the layout.

<script src="https://gist.github.com/tommyip/35484e2839e404a861ed88063a0321ce.js"></script>

The default `multicol` environment balance your text equally on both columns.
By using `multicol*` a new column is created only when your text reaches the
end of the page.

<script src="https://gist.github.com/tommyip/f877acbfb267471b6d605812f5c1aa14.js"></script>

<hr class="p-divider">

## Tip #4: No page numbering

If you are writing a short document, chances are that you don't want page numbering.
You can set its style to `gobble` to remove them.

<script src="https://gist.github.com/tommyip/12f87c8ecac9ea2d31add3479e4d4674.js"></script>

<hr class="p-divider">

## Tip #5: Tables

Tables are a fundamental element of LaTeX, getting it right is essential for a
professional look. If you just want a template, here you go:

<script src="https://gist.github.com/tommyip/9bfefeaec637a1f9bb98e7a4d93faa43.js"></script>

Lets break down what's going on.

* One of the important style guidelines of LaTeX tables is avoiding vertical
  lines as well as "boxing up" cells (too many horizontal lines). The
  package `booktabs` provides a few useful macros, most notably
  `\toprule`, `\midrule` and `\bottomrule`. The middle rule is thinner than the
  other ones and should be placed right after the label (top) row.

* The `H` parameter (line 7) places the table at precisely the location in the
  LaTeX code. This requires the `float` package.

* Another rule in making nice tables is: *"When in doubt, align left."*. For
  the caption, we can do that using `\captionsetup{singlelinecheck = false}`.
  And for each cell, the alignment are set in line 9, `lll` means left align
  all 3 columns. The symbol `@{}` remove space to the vertical edge.

* Since we are in a multicol environment, we set the table width to be half of
  the text width using `{0.5\textwidth}`.

* The `@{\extracolsep{\fill}}` argument positions each columns so that they are
  evenly spaced across the whole table.

<hr class="p-divider">

## Tip #6: Inlined bibliography

When writing short documents, you are unlikely to have many references (or any
at all). Inlining the bibliography into your `.tex` file is a huge time saver.

<script src="https://gist.github.com/tommyip/ea00bdebc05a18c970582ce881839d03.js"></script>

<hr class="p-divider">

That's all for now, comment down below if you have more tips & tricks for
writing single page documents!
