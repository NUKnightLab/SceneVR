module.exports = class ProgressCube {
    constructor() {

        this.el = {
            message: document.getElementById("svr-loading-message"),
            sides: document.querySelectorAll(".svr-loading-face-side"),
            faces: document.querySelectorAll(".svr-loading-face"),
            bottom: document.querySelector(".svr-loading-face-bottom")
        }

        this.color = {
            load: `rgba(43, 43, 43,0.7)`,
            done: `rgba(43, 43, 43,0.7)`,
            base: `rgba(72, 72, 72, 0.2)`
        }

        this.performance_data = window.performance.timing,
        this.estimated_time = -(this.performance_data.loadEventEnd - this.performance_data.navigationStart),
        this.time = {
            timer: {},
            start: 0,
            end: 100,
            estimated: 0,
            step: 0,
            increment:0,
            current: 0,
            range: 0
        }

        this.time.estimated = (parseInt((this.estimated_time/1000)%60)*100) * 2;

        console.debug(`Estimated time to load ${this.time.estimated}`);

        this.animateProgress();

    }

    animateProgress() {
        this.time.range = this.time.end - this.time.start;
        this.time.increment = this.time.end > this.time.start? 1 : -1;
        this.time.step = Math.abs(Math.floor(this.time.estimated / this.time.range));

        this.el.bottom.style.background = this.color.load;


        this.time.timer = setInterval(()=> {
            this.time.current += this.time.increment;
            this.el.bottom.innerHTML = this.time.current;

            for (let i = 0; i < this.el.sides.length; i++) {
                this.el.sides[i].style.background = `linear-gradient(to bottom, ${this.color.load} 0%,${this.color.load} ${this.time.current}%,${this.color.base} ${this.time.current+1}%, ${this.color.base} 100%)`;
            }

            if (this.time.current == this.time.end) {
                clearInterval(this.time.timer);
                for (let i = 0; i < this.el.faces.length; i++) {
                    // loading_faces[i].style.border = `1px solid ${load_color}`;
                    this.el.faces[i].style.background = `${this.color.done}`;
                }
            }
        }, this.time.step);
    }



}
