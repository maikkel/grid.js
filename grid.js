/*
Grid.js v0.1.1
Copyright 2014 Maik Kellerhals <maik.kellerhals@gmail.com> 
2014-06-29 
*/

var GRID = function(grid) {
    var componentToHex = function(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    };
    var r = 0;
    var g = 0;
    var b = 0;
    grid.color = {};
    grid.color.makeObject = function(hex) {
        var hexCut = hex.substring(1, 7);
        var rInt = parseInt(hexCut.substring(0, 2), 16);
        var gInt = parseInt(hexCut.substring(2, 4), 16);
        var bInt = parseInt(hexCut.substring(4, 6), 16);
        return {
            r: rInt,
            g: gInt,
            b: bInt,
            hex: hex
        };
    };
    grid.color.randomColor = function() {
        return "#" + componentToHex(parseInt(Math.random() * 255)) + componentToHex(parseInt(Math.random() * 255)) + componentToHex(parseInt(Math.random() * 255));
    };
    grid.color.makeGrey = function(val) {
        if (val < 16) {
            return "#0" + val.toString(16) + "0" + val.toString(16) + "0" + val.toString(16);
        } else {
            return "#" + val.toString(16) + val.toString(16) + val.toString(16);
        }
    };
    grid.color.fadeColor = function(color, amount) {
        r = componentToHex(Math.floor(amount * color.r));
        g = componentToHex(Math.floor(amount * color.g));
        b = componentToHex(Math.floor(amount * color.b));
        return "#" + r + g + b;
    };
    return grid;
}(GRID || {});

var GRID = function(grid) {
    var animations = {
        BLINK: 0,
        FADEIN: 1,
        FADEOUT: 2
    };
    grid.Pixel = function(x, y) {
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
        };
    };
    grid.Pixel.prototype.blink = function(color, strength, rate) {
        if (!this.locked) {
            this.animation = animations.BLINK;
            color = grid.color.makeObject(color);
            strength = strength || 255;
            rate = rate || this.rate;
            this.color = color;
            this.rate = rate;
            this.counter = strength;
            if (jQuery.inArray(this, grid.updateArray) == -1) {
                grid.updateArray.push(this);
            }
        }
    };
    grid.Pixel.prototype.fadeIn = function(color, rate) {
        if (!this.locked) {
            this.animation = animations.FADEIN;
            this.locked = true;
            color = grid.color.makeObject(color);
            rate = rate || this.rate;
            this.color = color;
            this.rate = rate;
            this.counter = 0;
            if (jQuery.inArray(this, grid.updateArray) == -1) {
                var pixel = this;
                grid.updateArray.push(pixel);
            }
        }
    };
    grid.Pixel.prototype.fadeOut = function(color, rate) {
        this.animation = animations.FADEOUT;
        this.locked = true;
        color = grid.color.makeObject(color);
        rate = rate || this.rate;
        this.color = color;
        this.rate = rate;
        this.counter = 255;
        if (jQuery.inArray(this, grid.updateArray) == -1) {
            var pixel = this;
            grid.updateArray.push(pixel);
        }
    };
    grid.Pixel.prototype.update = function() {
        if (this.animation == animations.BLINK) {
            this.updateBLINK();
        } else if (this.animation == animations.FADEIN) {
            this.updateFADEIN();
        } else if (this.animation == animations.FADEOUT) {
            this.updateFADEOUT();
        }
    };
    grid.Pixel.prototype.updateFADEIN = function() {
        if (this.counter <= 255) {
            grid.draw.pixelClear(this.x, this.y);
            grid.draw.pixelSize(this.x, this.y, this.color.hex, this.counter / 255, 0);
            this.counter += this.rate;
        } else {
            this.counter = 255;
            grid.draw.pixelSize(this.x, this.y, this.color.hex, this.counter / 255, 0);
            this.done = true;
        }
    };
    grid.Pixel.prototype.updateFADEOUT = function() {
        if (this.counter >= 0) {
            grid.draw.pixelClear(this.x, this.y);
            grid.draw.pixelSize(this.x, this.y, this.color.hex, this.counter / 255, 0);
            this.counter -= this.rate;
        } else {
            this.counter = 0;
            grid.draw.pixelClear(this.x, this.y);
            this.done = true;
            this.locked = false;
        }
    };
    grid.Pixel.prototype.updateBLINK = function() {
        if (this.counter >= 0) {
            if (grid.fadeMode == GRID.FadeModes.FADE) {
                grid.draw.pixel(this.x, this.y, grid.color.fadeColor(this.color, this.counter / 255));
            } else if (grid.fadeMode == GRID.FadeModes.ZOOM) {
                grid.draw.pixelClear(this.x, this.y);
                grid.draw.pixelSize(this.x, this.y, this.color.hex, this.counter / 255);
            } else if (grid.fadeMode == GRID.FadeModes.FADEANDZOOM) {
                grid.draw.pixelClear(this.x, this.y);
                grid.draw.pixelSize(this.x, this.y, grid.color.fadeColor(this.color, this.counter / 255), this.counter / 255);
            }
            this.counter -= this.rate;
        } else {
            this.counter = 0;
            this.done = true;
        }
    };
    return grid;
}(GRID || {});

var GRID = function(grid) {
    grid.addBox = function(posX, posY, width, height, color) {
        return new grid.Box(posX, posY, width, height, color);
    };
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
    };
    function pixelIn(x, y, box) {
        setTimeout(function() {
            var pixel = grid.pixels[x + box.x][y + box.y];
            pixel.fadeIn(box.color, 32);
            pixel.locked = true;
        }, x * 20 + y * 30 + Math.random() * 200);
    }
    function pixelOut(x, y, box) {
        setTimeout(function() {
            var pixel = grid.pixels[x + box.x][y + box.y];
            pixel.fadeOut(box.color, 32);
            pixel.locked = true;
        }, x * 20 + y * 30 + Math.random() * 200);
    }
    grid.Box.prototype.remove = function() {
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                pixelOut(x, y, this);
            }
        }
    };
    return grid;
}(GRID || {});

var GRID = function(grid) {
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
            curX0 = parseInt(e.pageX / grid.pixelSize);
            curY0 = parseInt(e.pageY / grid.pixelSize);
            if (curX0 != pixelX0 || curY0 != pixelY0) {
                pixelX0 = curX0;
                pixelY0 = curY0;
                if (grid.pixels[pixelX0][pixelY0] != undefined) {
                    grid.pixels[pixelX0][pixelY0].blink("#ff0000", Math.floor(Math.random() * 255), 8);
                }
            }
        }
    };
    grid.input.trailMobile = function(e) {
        var event = window.event;
        if (grid.mouseTrail) {
            curX0 = parseInt(event.touches[0].pageX / grid.pixelSize);
            curY0 = parseInt(event.touches[0].pageY / grid.pixelSize);
            if (curX0 != pixelX0 || curY0 != pixelY0) {
                pixelX0 = curX0;
                pixelY0 = curY0;
                if (grid.pixels[pixelX0][pixelY0] != undefined) {
                    grid.pixels[pixelX0][pixelY0].blink("#ff0000", Math.floor(Math.random() * 255), 8);
                }
            }
            if (event.touches[1] != undefined) {
                curX1 = parseInt(event.touches[1].pageX / grid.pixelSize);
                curY1 = parseInt(event.touches[1].pageY / grid.pixelSize);
                if (curX1 != pixelX1 || curY1 != pixelY1) {
                    pixelX1 = curX1;
                    pixelY1 = curY1;
                    if (grid.pixels[pixelX1][pixelY1] != undefined) {
                        grid.pixels[pixelX1][pixelY1].blink("#ffff00", Math.floor(Math.random() * 255), 8);
                    }
                }
            }
        }
        e.preventDefault();
    };
    grid.input.setup = function() {
        $(document).mousemove(function(e) {
            grid.input.trail(e);
        });
        $(document).on("touchmove", function(e) {
            grid.input.trailMobile(e);
        });
    };
    return grid;
}(GRID || {});

var GRID = function(grid) {
    grid.log = function(str) {
        console.log("GRID | " + str);
    };
    return grid;
}(GRID || {});

var GRID = function(grid) {
    grid.draw = {};
    grid.draw.pixel = function(x, y, color, pixelSize) {
        var gap;
        if (pixelSize == undefined) {
            gap = grid.pixelGap;
        } else {
            gap = (grid.pixelSize - pixelSize) / 2;
        }
        var size = pixelSize || grid.pixelSize - gap * 2;
        grid.context.beginPath();
        grid.context.rect(x * grid.pixelSize + gap, y * grid.pixelSize + gap, size, size);
        grid.context.fillStyle = color;
        grid.context.fill();
    };
    grid.draw.pixelSize = function(x, y, color, pixSize, gap) {
        var size = (grid.pixelSize - gap * 2) * pixSize;
        grid.context.beginPath();
        grid.context.rect(x * grid.pixelSize + gap + .5 * (grid.pixelSize - gap - size), y * grid.pixelSize + gap + .5 * (grid.pixelSize - gap - size), size, size);
        grid.context.fillStyle = color;
        grid.context.fill();
    };
    grid.draw.pixelClear = function(x, y) {
        grid.context.clearRect(x * grid.pixelSize, y * grid.pixelSize, grid.pixelSize, grid.pixelSize);
    };
    return grid;
}(GRID || {});

window.requestAnimationFrame = function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(f) {
        window.setTimeout(f, 1e3 / 60);
    };
}();

var GRID = function(grid) {
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
    var interval = 1e3 / grid.maxFps;
    var first = then;
    var counter = 0;
    var second = 0;
    var second_since = 0;
    var second_fps = 0;
    var randomPixel = undefined;
    var update = function() {
        grid.random = Math.random();
        grid.doneArray.length = 0;
        $.each(grid.updateArray, function(index, pixel) {
            pixel.update();
            if (pixel.done) {
                grid.doneArray.push(pixel);
                pixel.done = false;
            }
        });
        $.each(grid.doneArray, function(index, pixel) {
            var i = jQuery.inArray(pixel, grid.updateArray);
            if (i > -1) {
                grid.updateArray.splice(i, 1);
            }
        });
        if (grid.random <= .5) {
            for (var i = 0; i < grid.iterations; i++) {
                randomPixel = grid.pixels[Math.floor(Math.random() * grid.pixelCountX)][Math.floor(Math.random() * grid.pixelCountY)];
                randomPixel.blink("#00ff00", Math.floor(Math.random() * 255), 4);
            }
        } else if (grid.random > .5) {
            for (var i = 0; i < grid.iterations; i++) {
                randomPixel = grid.pixels[Math.floor(Math.random() * grid.pixelCountX)][Math.floor(Math.random() * grid.pixelCountY)];
                randomPixel.blink("#0000ff", Math.floor(Math.random() * 255), 4);
            }
        }
    };
    grid.render = function() {
        requestAnimationFrame(grid.render);
        grid.random = Math.random();
        now = Date.now();
        delta = now - then;
        if (delta > interval) {
            if (second > 1e3) {
                second_since = Date.now();
                second = 0;
                grid.curFps = second_fps;
                second_fps = 0;
            } else {
                second = Date.now() - second_since;
                ++second_fps;
            }
            then = now - delta % interval;
            timeFromStart = (then - first) / 1e3;
            update();
        }
    };
    return grid;
}(GRID || {});

var GRID = function(grid) {
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
    grid.fadeMode = grid.FadeModes.FADE;
    grid.pixelCountX = 0;
    grid.pixelCountY = 0;
    grid.log("GRID.js v." + grid.version + " loaded");
    var onWindowResize = function() {
        grid.log("Window resized");
        grid.setup();
    };
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
            grid.pixels[x] = new Array(grid.pixelCountY);
            for (var y = 0; y < grid.pixelCountY; y++) {
                grid.pixels[x][y] = new grid.Pixel(x, y);
            }
        }
    };
    grid.start = function(canvas) {
        grid.log("start! " + grid.version);
        grid.canvas = canvas || $("canvas");
        grid.context = grid.canvas[0].getContext("2d");
        $(window).resize(onWindowResize);
        grid.input.setup();
        grid.setup();
        grid.render();
    };
    return grid;
}(GRID || {});
//# sourceMappingURL=grid.js.map