/**
 * Created by kelmai on 19/06/14.
 */

var GRID = (function (grid) {
    grid.input = {};

    grid.mouseTrail = true;


    var pixelX0 = -1;
    var pixelY0 = -1;
    var curX0 = -1;
    var curY0 = -1;
    var pixelX1 = -1;
    var pixelY1 = -1;
    var curX1 = -1;
    var curY1 = -1;

    grid.input.trail = function(e) {

        if (grid.mouseTrail) {
            curX0 = parseInt(e.pageX/grid.pixelSize);
            curY0 = parseInt(e.pageY/grid.pixelSize);

            if (curX0 != pixelX0 || curY0 != pixelY0) {
                pixelX0 = curX0;
                pixelY0 = curY0;
                if (grid.pixels[pixelX0][pixelY0] != undefined) {
                    grid.pixels[pixelX0][pixelY0].blink("#ff0000",Math.floor(Math.random()*255), 8);
                }
            }
        }
    }

    grid.input.trailMobile = function(e) {



        var event = window.event;

        if (grid.mouseTrail) {
            curX0 = parseInt(event.touches[0].pageX /grid.pixelSize);
            curY0 = parseInt(event.touches[0].pageY /grid.pixelSize);

            if (curX0 != pixelX0 || curY0 != pixelY0 ) {
                pixelX0 = curX0;
                pixelY0 = curY0;
                if (grid.pixels[pixelX0][pixelY0] != undefined) {
                    grid.pixels[pixelX0][pixelY0].blink("#ff0000",Math.floor(Math.random()*255), 8);
                }
            }
            if (event.touches[1] != undefined) {
                curX1 = parseInt(event.touches[1].pageX /grid.pixelSize);
                curY1 = parseInt(event.touches[1].pageY /grid.pixelSize);
                if (curX1 != pixelX1 || curY1 != pixelY1 ) {
                    pixelX1 = curX1;
                    pixelY1 = curY1;
                    if (grid.pixels[pixelX1][pixelY1] != undefined) {
                        grid.pixels[pixelX1][pixelY1].blink("#ffff00",Math.floor(Math.random()*255), 8);
                    }
                }
            }

        }
        e.preventDefault();
    }

    grid.input.setup = function() {

        $( document ).mousemove(function(e){
            grid.input.trail(e);
        });
        $( document ).on("touchmove", function(e) {
            grid.input.trailMobile(e);

        });
    }


    return grid;
}(GRID || {}));