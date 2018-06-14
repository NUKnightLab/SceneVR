module.exports = {
    createElement: (tag, id, classes) => {
        let el = document.createElement(tag);
        if(id) {
            el.id = id;
        }
        if(classes) {
            el.className = classes.join(' ');
        };
        return el;
    }
}
