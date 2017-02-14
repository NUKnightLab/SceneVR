'use strict';
const images = require('./controllers/images');
const compress = require('koa-compress');
const logger = require('koa-logger');
const serve = require('koa-static');
const route = require('koa-route');
const koa = require('koa');
const path = require('path');
const app = module.exports = koa();

// Logger
app.use(logger());

app.use(route.get('/', images.home));
app.use(route.get('/aframe/:image', images.aframe));
app.use(route.get('/story/new', images.newStory));
app.use(route.get('/story/:id', images.show));
app.use(route.get('/story/edit/:id', images.edit));
app.use(route.post('/story', images.create));
app.use(route.post('/story/:id', images.update));

// Serve static files
app.use(serve(path.join(__dirname, 'public')));

// Compress
app.use(compress());

if (!module.parent) {
  app.listen(3000);
  console.log('listening on port 3000');
}
