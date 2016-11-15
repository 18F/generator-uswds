# Page Templates

These HTML files are page templates that may serve as useful starting points
for new pages. Note that these templates reference assets ([CSS](../css),
[JavaScript](../js), [fonts](../fonts), and [images](../images)) _relatively_,
which means that their URLs will need to change if you move them up or down a
directory level. For instance:

* If you were to copy `landing.html` to the project "root" directory, you would
  need to remove all of the `../` path prefixes in your `<link>` and `<script>`
  tags.
* If you were to create a new directory hierarchy called `regions/west` and
  copy `documentation.html` into it, each of the `../` path prefixes in your
  `<link>` and `<script>` tags would need to be changed to `../../`.
