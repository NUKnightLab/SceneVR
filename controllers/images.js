'use strict';
const views = require('co-views');
const parse = require('co-body');
const db = require('monk')('localhost/aframe');
const stories = db.get('stories');

const render = views(__dirname + '/../views', {
  map: { html: 'swig' }
});

module.exports.home = function *home() {
  let allStories = yield stories.find({});
  this.body = yield render('home', { stories: allStories });
};

module.exports.aframe = function *aframe(image) {
  this.body = yield render('aframe', { 'path': `../img/${image}` });
};

module.exports.helloworld = function *helloworld(image) {
  this.body = yield render('helloworld', {});
};

// show form to create new story
module.exports.newStory = function *newStory() {
  let results = yield stories.findOne({});
  this.body = yield render('story/new', {});  
};

// create new story
module.exports.create = function *create() {
  let input = yield parse(this);
  let story = yield stories.insert({
    title: input.title,
    author: input.author,
    description: input.description,
    location: input.location,
    image_path: input.image
  });
  this.redirect(`story/${story._id}`)
};

// show story
module.exports.show = function *show(id) {
  let story = yield stories.findOne({ _id: id });
  this.body = yield render('story/show', {
    title: story.title,
    author: story.author,
    description: story.description,
    location: story.location,
    imagePath: story.image_path
  });
};

// show editor
module.exports.edit = function *edit(id) {
  let story = yield stories.findOne({ _id: id });
  this.body = yield render('story/edit', {
    id: story._id.toString(),
    title: story.title,
    author: story.author,
    description: story.description,
    location: story.location,
    imagePath: story.image_path
  });
};

// edit story
module.exports.update = function *update(id) {
  let input = yield parse(this);
  yield stories.update(id, {
    title: input.title,
    author: input.author,
    description: input.description,
    location: input.location,
    image_path: input.image
  });
  this.redirect(`${id}`);
};
