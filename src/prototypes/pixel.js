/**
 * Created by kelmai on 19/06/14.
 */
var GRID = (function (grid) {

    var animations = {
        BLINK: 0,
        FADEIN: 1,
        FADEOUT: 2
    };

    grid.Pixel = function(x,y) {
        this.x = x;
        this.y = y;
        this.locked = false;
        this.counter = 0;
        this.done = false;
        this.rate = 8;
        this.animation = animations.BLINK;
        this.color = {
            r: 0,
            g: 0,
            b: 0,
            hex: "#000000"
        }

    }


    grid.Pixel.prototype.blink = function(color, strength, rate) {
        if (!this.locked) {
            this.animation = animations.BLINK;
            color = grid.color.makeObject(color);

            strength = strength || 255;
            rate = rate || this.rate;
            this.color = color;
            this.rate = rate;

            this.counter = strength;
            if (jQuery.inArray( this, grid.updateArray ) == -1){
                //grid.draw.pixelClear(this.x,this.y);
                grid.updateArray.push(this);
            }
        }
    }

    grid.Pixel.prototype.fadeIn = function(color, rate) {
        if (!this.locked) {

            this.animation = animations.FADEIN;
            this.locked = true;
            color = grid.color.makeObject(color);
            rate = rate || this.rate;

            this.color = color;
            this.rate = rate;

            this.counter = 0;
            if (jQuery.inArray( this, grid.updateArray ) == -1){
                var pixel = this;

                grid.updateArray.push(pixel);

            }
        }
    }

    grid.Pixel.prototype.fadeOut = function(color, rate) {


            this.animation = animations.FADEOUT;
            this.locked = true;
            color = grid.color.makeObject(color);
            rate = rate || this.rate;

            this.color = color;
            this.rate = rate;

            this.counter = 255;
            if (jQuery.inArray( this, grid.updateArray ) == -1){
                var pixel = this;

                grid.updateArray.push(pixel);

            }
    }



    grid.Pixel.prototype.update = function() {
        if (this.animation == animations.BLINK) {
            this.updateBLINK();
        } else if (this.animation == animations.FADEIN) {
            this.updateFADEIN();
        } else if (this.animation == animations.FADEOUT) {
            this.updateFADEOUT();
        }
    }

    grid.Pixel.prototype.updateFADEIN = function() {
        if (this.counter <= 255) {

            grid.draw.pixelClear(this.x,this.y);
            grid.draw.pixelSize(
                this.x,
                this.y,
                this.color.hex,
                this.counter / 255,
                0
            );

            this.counter += this.rate;
        } else {
            this.counter = 255
            grid.draw.pixelSize(
                this.x,
                this.y,
                this.color.hex,
                this.counter / 255,
                0
            );
            this.done = true;
        }
    }

    grid.Pixel.prototype.updateFADEOUT = function() {
        if (this.counter >= 0) {

            grid.draw.pixelClear(this.x,this.y);
            grid.draw.pixelSize(
                this.x,
                this.y,
                this.color.hex,
                this.counter / 255,
                0
            );

            this.counter -= this.rate;
        } else {
            this.counter = 0
            grid.draw.pixelClear(this.x,this.y);
            this.done = true;
            this.locked = false;
        }
    }

    grid.Pixel.prototype.updateBLINK = function() {
        if (this.counter >= 0) {

            if (grid.fadeMode == GRID.FadeModes.FADE) {
                grid.draw.pixel(
                    this.x,
                    this.y,
                    grid.color.fadeColor(
                        this.color,
                        this.counter / 255
                    )
                );
            } else if (grid.fadeMode == GRID.FadeModes.ZOOM) {
                grid.draw.pixelClear(this.x,this.y);
                grid.draw.pixelSize(
                    this.x,
                    this.y,
                    this.color.hex,
                    this.counter / 255
                );

            } else if (grid.fadeMode == GRID.FadeModes.FADEANDZOOM) {
                grid.draw.pixelClear(this.x,this.y);
                grid.draw.pixelSize(
                    this.x,
                    this.y,
                    grid.color.fadeColor(
                        this.color,
                        this.counter / 255
                    ),
                    this.counter / 255
                );

            }

            this.counter -= this.rate;
        } else {
            this.counter = 0;
            this.done = true;
        }
    }

    return grid;
}(GRID || {}));