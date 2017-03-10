var cssmin = require('cssmin'),
    fs = require('fs-extra'),
    css = fs.readFileSync("dist/css/orangeline.css", 'utf8'),
    min = cssmin(css);

fs.outputFileSync('dist/css/orangeline.min.css', min, 'utf8');
