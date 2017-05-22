var cssmin = require('cssmin'),
    fs = require('fs-extra'),
    css = fs.readFileSync("dist/css/scene.css", 'utf8'),
    min = cssmin(css);

fs.outputFileSync('dist/css/scene.min.css', min, 'utf8');
