/**
 * Created by kelmai on 19/06/14.
 */
// rAF
window.requestAnimationFrame = function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function(f) {
            window.setTimeout(f,1e3/60);
        }
}();


var GRID = (function (grid) {
    grid.maxFps = 30;
    grid.curFps = 0;

    grid.updateArray = new Array();
    grid.doneArray = new Array();

    grid.random;

    grid.iterations = 1;


    var then = Date.now();
    var now = Date.now();
    var delta = now - then;
    var timeFromStart = 0;
    var interval = 1000/grid.maxFps;
    var first = then;
    var counter = 0;
    var second = 0;
    var second_since = 0;
    var second_fps = 0;

    var randomPixel = undefined;

    var update = function() {
        grid.random = Math.random();



        grid.doneArray.length = 0;

        $.each(grid.updateArray, function( index, pixel ) {
            pixel.update();
            if (pixel.done) {
                grid.doneArray.push(pixel);
                pixel.done = false;
            }
        });

        $.each(grid.doneArray, function( index, pixel ) {
            var i = jQuery.inArray( pixel, grid.updateArray )
            if (i > -1) {
                grid.updateArray.splice(i, 1);
            }
        });


        if (grid.random <= 0.5) {
            for (var i = 0; i < grid.iterations; i++) {
                randomPixel =  grid.pixels[Math.floor(Math.random()*grid.pixelCountX)][Math.floor(Math.random()*grid.pixelCountY)];
                randomPixel.blink("#00ff00",Math.floor(Math.random()*255), 4);
            }
        } else if (grid.random > 0.5) {
            for (var i = 0; i < grid.iterations; i++) {
                randomPixel =  grid.pixels[Math.floor(Math.random()*grid.pixelCountX)][Math.floor(Math.random()*grid.pixelCountY)];
                randomPixel.blink("#0000ff",Math.floor(Math.random()*255), 4);
            }
        }
    }

    grid.render = function() {
        requestAnimationFrame(grid.render);

        grid.random = Math.random();

        now = Date.now();
        delta = now - then;

        if (delta > interval) {
            if (second > 1000) {
                second_since = Date.now();
                second = 0;

                grid.curFps = second_fps;

                second_fps = 0;
            } else {
                second = Date.now() - second_since;
                ++second_fps;
            }

            then = now - (delta % interval);
            timeFromStart = (then - first)/1000;

            update();

        }
    }

    return grid;
}(GRID || {}));