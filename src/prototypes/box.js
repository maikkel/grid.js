/**
 * Created by kelmai on 19/06/14.
 */
var GRID = (function (grid) {

    grid.addBox = function(posX, posY, width, height, color) {
        return new grid.Box(posX, posY, width, height, color);
    }



    grid.Box = function(posX, posY, width, height, colors) {
        this.setup(posX, posY, width, height, colors);
    }

    grid.Box.prototype.setup = function(posX, posY, width, height, colors) {
        this.x = posX;
        this.y = posY;
        this.width = width;
        this.height = height;
        this.color = colors || "#ffffff";
        this.colors;
        this.gap = 0;
        if (this.color instanceof Array) {
            this.colors = colors
        } else {
            this.colors = new Array(this.width);
            for (var x = 0; x < this.width; x++) {
                this.colors[x] = new Array(this.height);
                for (var y = 0; y < this.height; y++) {
                    this.colors[x][y] = this.color;
                }
            }
        }
    }

    grid.Box.prototype.setImage = function(imageUrl, callback) {
        // load image from data url
        var imageObj = new Image();

        var box = this;

        imageObj.src = imageUrl;
        imageObj.onload = function() {
            var canvas = $('<canvas/>')[0];
            canvas.width = this.width;
            canvas.height = this.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(this, 0, 0, this.width, this.height);
            var imgd = ctx.getImageData(0, 0, this.width, this.height);
            var data = imgd.data;



            for (var x = 0; x < this.width; x++) {
                for (var y = 0; y < this.height; y++) {
                    var i = ((y * this.width) + x) * 4;
                    if (box.colors[x] != undefined && box.colors[x][y] != undefined) {
                        box.colors[x][y] = grid.color.rgbToHex(data[i], data[i+1], data[i+2]);
                    }

                }
            }
            callback();
        };
    }

    grid.Box.prototype.show = function(gap) {
        this.gap = gap || this.gap;
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                pixelIn(x, y, this);
            }
        }
    }

    grid.Box.prototype.hide = function() {
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                pixelOut(x, y, this);
            }
        }
    }

    function pixelIn(x, y, box) {
        setTimeout(function() {
            var pixel = grid.pixels[x+box.x][y+box.y]
            pixel.fadeIn(box.colors[x][y], 32, box.gap);
            pixel.locked = true;
        }, x*20 + y*30 + Math.random()*200);
    }

    function pixelOut(x, y, box) {
        setTimeout(function() {
            var pixel = grid.pixels[x+box.x][y+box.y]
            pixel.fadeOut(box.colors[x][y], 32, box.gap);
            pixel.locked = true;
        }, x*20 + y*30 + Math.random()*200);
    }






    return grid;
}(GRID || {}));