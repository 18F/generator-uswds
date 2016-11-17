# generator-uswds
A [Yeoman] generator for the U.S. Draft Web Design Standards!

## Install it
This isn't published on npm yet, but for now you can install it with:

```sh
npm install -g github:18F/generator-uswds
```

Alternatively (or if you want to contribute!) you can clone this repo then run:

```sh
npm install
npm link
```

## Run it

```sh
cd my-new-project
yo uswds
```

## Project layout
After you run this generator, your directory structure should look like this:

<pre>
your-project/
├── <a href="#css">css/</a>
├── <a href="#fonts">fonts/</a>
├── <a href="#images">images/</a>
├── <a href="#js">js/</a>
├── <a href="#sass">sass/</a>
├── <a href="#page-templates">page-templates/</a>
└── <a href="#packagejson">package.json</a>
</pre>

Note the pattern: each _type_ of file gets its own top-level directory, and (with the exception of `css`) each of them has a `vendor/uswds` subtree containing the static USWDS assets of that type. This layout is meant to accommodate the addition of site-specific assets alongside USWDS. Each directory contains a `README.md` (in [Markdown]) describing its contents. Here is an overview:

### `css`
The `css` directory contains CSS _generated_ from the [Sass] source files in [`scss`](#scss). The CSS files are minified to discourage direct editing.

### `fonts`
The USWDS custom fonts (Merriweather and Source Sans Pro) live in the `fonts/vendor/uswds` directory. Additional fonts can be placed in this directory and referenced from the [Sass][#sass].

### `images`
The USWDS images live in the `images/vendor/uswds` directory. Additional images can be placed in this directory, and may be referenced relatively from the [Sass](#sass), e.g. in `background-image` properties via `url(../images/path/to/image.png)`.

### `js`
The `js` directory contains your site's JavaScript:

1. `js/vendor/uswds` contains both minified and un-minified versions of `uswds.js`. **You should always use `uswds.min.js` in your templates unless you need to be able to debug USWDS _and_ lack a browser with [source map] support.**
1. `main.js` is a placeholder for your site's custom scripts, and is imported out of the box in the [page templates](#page-templates).

### `page-templates`
This directory contains both of the [USWDS page templates](https://standards.usa.gov/page-templates/) as standalone HTML files. We suggest copying these files and customizing them for your needs rather than editing them in place. This can make it easier to test customizations that you make to the [Sass](#sass), and allows you to compare changes that you've made in other pages to the originals if you end up breaking something by accident.

### `sass`
The `sass` directory contains all of the [Sass] source files for the USWDS and a `main.scss` file from which you can customize the system. We suggest working in this file to get a feel for it, then factoring your work into additional Sass "partials" for more component-oriented CSS rules. For instance, you could organize your `sass` directory like this:

<pre>
├── my-project/
|   ├── _all.scss
|   └── # other files imported by _all.scss
├── vendor/uswds/...
├── _variables.scss
└── main.scss
</pre>

Then your `main.scss` could be structured like so:

```scss
# this should go before importing uswds
@import 'variables';
@import 'vendor/uswds/all';
# and this should go after if your styles override uswds rules in any way
@import 'my-project/all';
```

See [tasks](#tasks) below for more information on regenerating the CSS files from Sass.

### `package.json`
Your `package.json` tells [npm] about your project's JavaScript dependencies. After your directory is created, the Yeoman generator runs `npm install` to install the depenencies used for building your [CSS](#css) file(s) from the [Sass](#sass) sources.

## Tasks
The `package.json` defines the following tasks in the `scripts` section:

* **`npm start`** (or `npm run start`)

  Starts a web server in your project directory so that you can preview your site at `http://127.0.0.1:8080`.

* **`npm run build:css`**

  Regenerates the [CSS](#css) from the [Sass](#sass) source files.

* **`npm run build`**

  Runs `npm run build:css`. In the future we may include other build commands for different asset types.

[Yeoman]: http://yeoman.io/
[Markdown]: https://en.wikipedia.org/wiki/Markdown
[Sass]: http://sass-lang.com/
[npm]: https://www.npmjs.com/
