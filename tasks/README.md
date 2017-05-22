## Compiling Templates

To compiles templates from hbs to html, simply run `npm run templates`. The two files in charge of compiling the templates are `compile-hbs.js` and `helpers/pattern-build-helper.js`. The latter pattern builder file creates the functionality such that handlebars understands the directory of a template component; i.e. `partials` or `pages` that appends a partial when including them on a page. The former compile script, handles the actual compilation of hbs files to html and uses the boilerplate template found in `src/templates/layouts/default.hbs` as a skeleton to render files.

### How it works
The folder directory is very important in determining how handlebars handles where and how files get rendered out to. Currently, the templates directory, `src/templates`, has 3 folders, `layouts`, `partials` and `pages`. `layouts` is where structural files that will be replicated across multiple pages will live. `partials` is where components of a page, i.e. a form element or a button will live. `pages` is where example product pages that implement orangeline will live. No other file except `index.hbs` should live outside of these folders. `index.hbs` will be the main index page for the rendered out content, which is basically the page you see when you navigate to [http://localhost:8080]().  

### How to use it
To utilize this templating system, drop in `{{partials [''name-of-partial-here]}}` into your file located in `src/templates/pages` or in `src/templates/partials`. 

### A note about front matter
Front matter is the content in the body of a partial, that is in between the triple dashses.

You can pass front matter into the partial in 2 ways.

#### 1. front matter front matter
You can pass in data to a partial via simple front matter that is in between 3 dashes like so:

---
title: knight lab
---
<p>Hello from {{title}}</p>

#### 2. front matter data file
You can pass in data specific to a partial by creating a new data file in `src/data/`. You then pass this data file into the partial like so:
`{{partials 'example' example}}`

#### **Important Note about front matter context.**
The thing to note, is that partials only have context for it's own front matter. This means that partials included in a parent page, does not have context of the parent partial. In order to ensure a child partial has context of it's parent, pass in the parent context like so, `{{partials 'example' this}}`. 

## Helpers 
Handlebars helpers found in `helpers/hbs-helper.js` are custom helpers for handlebars to add additional logic to templates. Existing logic for handlebars can be found [here](http://handlebarsjs.com/block_helpers.html).

## Debugging 
To debug handlebars, add `{{debug [this]}}` to your handlebars template and run `npm run templates` to output the context of your template to your terminal. To understand how this works, check out `helpers/debug-hbs.js`.
