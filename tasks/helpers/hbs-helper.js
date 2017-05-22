var Handlebars = require('handlebars');

Handlebars.registerHelper('is', function(actual, expected, options) {
  if(actual === expected) {
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
})
