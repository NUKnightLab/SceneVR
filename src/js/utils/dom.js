module.exports = {
    createElement: (tag, id, classes, add_to_container, content) => {
        let el = document.createElement(tag);
        if(id) {
            el.id = id;
        }
        if(classes) {
            el.className = classes.join(' ');
        };
        if (add_to_container) {
            add_to_container.appendChild(el);
        };
        if (content) {
            el.innerHTML = content;
        }
        return el;
    }
}
