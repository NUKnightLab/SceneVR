var Handlebars = require('handlebars'),
    fs = require('fs-extra'),
    _ = require('lodash'),
    globby = require('globby'),
    fm = require('front-matter');

/**
 * getDirectories: parses all files in view and returns a list of files that are directories
 *
 * @returns {Array} list of all directories in src/views/
 */
var getDirectories = function() {
  return fs.readdirSync('src/templates').filter(function(file) {
    return fs.statSync('src/templates/' + file).isDirectory();
  })
}

directories = getDirectories();

/**
 * getHelpers: registers a helper and renders the associated partial
 *
 * @param {function} Handlebars
 * @param {Array} directories
 * @returns {String} Handlebars rendered partial snippet
 */
var renderHelperPartial = function(Handlebars, directories) {
  directories.map(function(dir, index) {
    Handlebars.registerHelper(dir, function() {
      partialName = arguments[0];
      var filePath = './src/templates/' + dir + "/" + partialName + '.hbs';
      frontMatter = fm(fs.readFileSync(filePath, 'utf8'))
      template = frontMatter.body
      data = arguments[1] || {};
      var func = Handlebars.compile(template)
      return new Handlebars.SafeString(func(data))
    })
  })
}

renderHelperPartial(Handlebars, directories)
