module.exports = {
  createElement: (tag, id, classes) => {
    let el = document.createElement(tag);
    el.id = id;
    el.className = classes.join(' ');
    return el;
  }
}