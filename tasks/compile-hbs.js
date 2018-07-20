var _ = require('lodash'),
    fm = require('front-matter'),
    yml = require('yamljs'),
    fs = require('fs-extra'),
    path = require('path'),
    Handlebars = require('handlebars'),
    globby = require('globby'),
    debug = require('./helpers/debug-hbs.js'),
    helpers = require('./helpers/hbs-helper.js'),
    viewBuilder = require('./helpers/pattern-build-helper.js'),

    grabPatternData = globby.sync('src/data/*.yml'),
    viewData = getData(grabPatternData);

/**
 * getData: grabs an array of yml data files and returns their composes data as an object
 *
 * @param array ymlFiles
 * @returns object jsonData
 */
function getData(files) {
    var jsonData = {};

    files.map(function(file, i) {
        fileName = path.basename(file, '.yml')
        fileData = yml.load(file)
        jsonData[fileName] = fileData
    })
    return jsonData;
}

/**
 * renderTemplate: takes in a template path and matches it with it's associated data and outputs html
 *
 * @param string templatePath
 * @param object data
 * @returns string htmlString
 */
function renderTemplate(templatePath, data) {
  var file = fs.readFileSync(templatePath, 'utf8'),
      frontMatter = fm(file),
      fmData = frontMatter.attributes,
      context = _.extend(fmData, data),
      template = Handlebars.compile(frontMatter.body);
  return template(context);
}

/**
 * renderPage: passes a specific template through a layout and with associated data through a hbs function and returns a string
 *
 * @param string template
 * @param string layout
 * @param object data
 * @returns string html
 */
function renderPage(template, layout, data) {
  var file = fs.readFileSync(layout, 'utf8'),
      page = Handlebars.compile(file),
      context = _.extend({body: template}, data);
  return page(context);
}

/**
 * build: overarching function that builds out the partials and pages and outputs it to dist
 *
 * @returns {undefined}
 */
function build() {
  var hbsviews = globby.sync('src/templates/**/*.hbs');

  _.forEach(hbsviews, function(file, i) {
    var filePattern = path.dirname(file).split('src/templates/')[1],
        fileName = path.basename(file, '.hbs');
    if(filePattern === undefined) {
      var patternData = {},//yml.load('src/data/oldData.yml'),
          renderIndex = renderTemplate(file, patternData),
          page = renderPage(renderIndex, 'src/templates/layouts/default.hbs');

      fs.outputFileSync(`dist/${fileName}.html`, page, 'utf8');
    } else if(filePattern === 'layouts') {
      return;
    } else {
      var template = renderTemplate(file, viewData),
          page = renderPage(template, 'src/templates/layouts/default.hbs', viewData);

      fs.outputFileSync(`dist/templates/${filePattern}/${fileName}.html`, page, 'utf8')
    }
  });
}

build();
