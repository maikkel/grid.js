/**
 * @author Maik Kellerhals / http://www.maik.be/
 *
 * @todo Write/generate the documentation.
 * @todo remove jQuery dependency
 */

var GRID = (function (grid) {
    grid.version = "0.1.1";
    grid.canvas = undefined;
    grid.context = undefined;

    grid.pixels;
    grid.pixelSize = 16;
    grid.pixelGap = 1;

    grid.FadeModes = {
        FADE: 0,
        ZOOM: 1,
        FADEANDZOOM: 2
    };

    grid.fadeMode = grid.FadeModes.FADE ;

    grid.pixelCountX = 0;
    grid.pixelCountY = 0;



    grid.log("GRID.js v."+grid.version+" loaded");

    var onWindowResize = function() {
        grid.log("Window resized");
        grid.setup();
    }

    grid.setup = function() {

        grid.screenWidth = $(window).width();
        grid.screenHeight = $(window).height();

        grid.pixelCountX = parseInt(grid.screenWidth / grid.pixelSize) + 1;
        grid.pixelCountY = parseInt(grid.screenHeight / grid.pixelSize) + 1;

        grid.canvas[0].width = grid.screenWidth;
        grid.canvas[0].height = grid.screenHeight;



        if (grid.pixels != undefined) {
            grid.pixels.length = 0;
        }

        grid.pixels = new Array(grid.pixelCountX);
        for (var x = 0; x < grid.pixelCountX; x++) {
            grid.pixels[x] = new Array(grid.pixelCountY)
            for (var y = 0; y < grid.pixelCountY; y++) {
                grid.pixels[x][y] = new grid.Pixel(x, y);
            }
        }


    }

    grid.start = function(canvas) {

        grid.log("start! "+grid.version);
        grid.canvas = canvas || $("canvas");
        grid.context = grid.canvas[0].getContext('2d');

        $( window ).resize(onWindowResize);
        grid.input.setup();
        grid.setup();
        grid.render();
    }

    //test

    return grid;
}(GRID || {}));




