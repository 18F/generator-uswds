# JavaScript

This directory contains your site's JavaScript files. You can find the USWDS
script in [vendor/uswds.js](vendor/uswds.js).

## `main.js`
We've also included an empty [main.js](main.js), which is loaded in each [page
template](../page-templates) after USWDS. This is where you can do any
site-specific scripting, and the location of its `<script>` tag in the
templates is where you should add any additional scripts. For instance, if you
need [jQuery], we suggest:

1. [Download](http://jquery.com/download/) the version of jQuery that's right
   for you, and place it in the [vendor](vendor) directory.
1. Add the following HTML _before_ the `<script src="/js/main.js">` tag at the
   end of the relevant page template:

  ```html
  <script src="/js/vendor/jquery-3.1.1.min.js"></script>
  ```

[jQuery]: http://jquery.com
