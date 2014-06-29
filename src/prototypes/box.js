/**
 * Created by kelmai on 19/06/14.
 */
var GRID = (function (grid) {

    grid.addBox = function(posX, posY, width, height, color) {
        return new grid.Box(posX, posY, width, height, color);
    }



    grid.Box = function(posX, posY, width, height, color) {
        this.x = posX;
        this.y = posY;
        this.width = width;
        this.height = height;
        this.color = color || "#ffffff";
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                pixelIn(x, y, this);
            }
        }

    }

    function pixelIn(x, y, box) {
        setTimeout(function() {
            var pixel = grid.pixels[x+box.x][y+box.y]
            pixel.fadeIn(box.color, 32);
            pixel.locked = true;
        }, x*20 + y*30 + Math.random()*200);
    }

    function pixelOut(x, y, box) {
        setTimeout(function() {
            var pixel = grid.pixels[x+box.x][y+box.y]
            pixel.fadeOut(box.color, 32);
            pixel.locked = true;
        }, x*20 + y*30 + Math.random()*200);
    }

    grid.Box.prototype.remove = function() {
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                pixelOut(x, y, this);
            }
        }
    }




    return grid;
}(GRID || {}));