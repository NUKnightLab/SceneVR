const ProgressCube = require('./ui/ProgressCube.js');

window.SceneLoader = class SceneLoader {
    constructor(scenevr_url, config) {
        this.scenevr_url = scenevr_url;
        this.config = config;
        this.svr_time = {
            js_size: 665345, //bytes
            estimated: 0,
            start: 0,
            end: 0
        }
    }

    load_scenevr() {
        let script = document.createElement('script');
        var self = this;
        script.onload = function() {
            self.make_scene();
        }
        this.svr_time.start = (new Date()).getTime();
        script.src = this.scenevr_url;
        document.head.appendChild(script);
        let progress = new ProgressCube();
    }

    make_scene() {
        this.svr_time.end = (new Date()).getTime();

        let duration = (this.svr_time.end - this.svr_time.start) / 1000,
            bitsLoaded = this.svr_time.js_size * 8,
            speedBps = (bitsLoaded / duration).toFixed(2),
            speedKbps = (speedBps / 1024).toFixed(2),
            speedMbps = (speedKbps / 1024).toFixed(2),
            message = `Connection speed ${speedMbps} Mbps`;

        if (speedMbps > 10) {
            this.config.speed = "l";
        } else if (speedMbps > 5) {
            this.config.speed = "m";
        } else {
            this.config.speed = "s";
        }

        console.groupCollapsed("Connection Information");
        console.debug(`${message}`);
        console.debug(`SceneVR will use ${this.config.speed} images`);
        console.groupEnd();

        document.getElementById("svr-loading-message").innerHTML = message;

        Scene.init_scene(window, this.config);
    }

}
