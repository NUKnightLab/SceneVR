
let svr_config = {
    source: "/assets/test_panos/data.json",
    js_size: 1986547, //bytes
    time: {
        estimated: 0,
        start: 0,
        end:0
    }
};

function svr_init() {
    console.log(`init`);
    let message = document.getElementById("svr-loading-message"),
        loading_sides = document.querySelectorAll(".svr-loading-face-side"),
        loading_faces = document.querySelectorAll(".svr-loading-face"),
        loading_bottom = document.querySelector(".svr-loading-face-bottom"),
        load_color = `rgba(43, 199, 88,0.7)`,
        load_color_done = `rgba(43, 199, 88,0.2)`,
        load_color_base = `rgba(72, 72, 72, 0.2)`;

    // LOAD URL PARAMETERS
    function getQueryParams(query_params) {
        query_params = query_params.split("+").join(" ");

        var params = {},
            tokens,
            re = /[?&]?([^=]+)=([^&]*)/g;

        while (tokens = re.exec(query_params)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }

        return params;
    }

    const query_params = getQueryParams(window.location.search);
    if (query_params.hasOwnProperty('source')) {
        svr_config.source = query_params.source;
    }

    // LOAD SCENEVR JAVASCRIPT
    let script = document.createElement('script');
    script.onload = svr_init_scene;
    svr_config.time.start = (new Date()).getTime();
    script.src = "/js/scenevr.js";

    document.head.appendChild(script);

    // ANIMATE PROGRESS
    let perfData = window.performance.timing,
        estimatedTime = -(perfData.loadEventEnd - perfData.navigationStart),

        time_start = 0,
        time_end = 100;

    svr_config.time.estimated = (parseInt((estimatedTime/1000)%60)*100) * 2;

    console.debug(`Estimated time to load ${svr_config.time.estimated}`);

    function animateProgress() {
        let range = time_end - time_start,
            current = time_start,
            increment = time_end > time_start? 1 : -1,
            stepTime = Math.abs(Math.floor(svr_config.time.estimated / range));

        loading_bottom.style.background = `${load_color}`
        let timer = setInterval(function() {
            current += increment;
            message.innerHTML = `loading ... ${current}%`;
            for (let i = 0; i < loading_sides.length; i++) {
                loading_sides[i].style.background = `linear-gradient(to bottom, ${load_color} 0%,${load_color} ${current}%,${load_color_base} ${current+1}%, ${load_color_base} 100%)`;
            }
            if (current == time_end) {
                clearInterval(timer);
                for (let i = 0; i < loading_faces.length; i++) {
                    // loading_faces[i].style.border = `1px solid ${load_color}`;
                    loading_faces[i].style.background = `${load_color_done}`;
                }
            }
        }, stepTime);
    }

    animateProgress();


}

function svr_init_scene() {
    // CALCULATE CONNECTION SPEED
    svr_config.time.end = (new Date()).getTime();
    let duration = (svr_config.time.end - svr_config.time.start) / 1000;
    let bitsLoaded = svr_config.js_size * 8;
    let speedBps = (bitsLoaded / duration).toFixed(2);
    let speedKbps = (speedBps / 1024).toFixed(2);
    let speedMbps = (speedKbps / 1024).toFixed(2);
    let message = `connection speed ${speedMbps}Mbps`;

    if (speedMbps > 10) {
        svr_config.speed = "l";
    } else if (speedMbps > 5) {
        svr_config.speed = "m";
    } else {
        svr_config.speed = "s";
    }


    console.debug(message);
    console.debug(`using ${svr_config.speed} images`)
    document.getElementById("svr-loading-message").innerHTML = message;

    window.init_scene(svr_config);

}

window.onload = svr_init;
