/**
 * Created by Maik on 21.06.14.
 */
var GRID = (function (grid) {

    var componentToHex = function(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    var r = 0;
    var g = 0;
    var b = 0;

    grid.color = {};

    grid.color.makeObject = function(hex) {
        var hexCut = hex.substring(1, 7);
        var rInt = parseInt(hexCut.substring(0, 2), 16)
        var gInt = parseInt(hexCut.substring(2, 4), 16)
        var bInt = parseInt(hexCut.substring(4, 6), 16)

        return {
            r: rInt,
            g: gInt,
            b: bInt,
            hex: hex
        };
    }


    grid.color.randomColor = function() {
        return this.rgbToHex(parseInt(Math.random() * 255),parseInt(Math.random() * 255),parseInt(Math.random() * 255))
    }

    grid.color.rgbToHex = function(r, g, b) {
        return "#"+componentToHex(r)+componentToHex(g)+componentToHex(b);
    }

    grid.color.makeGrey = function(val) {
        if (val < 16) {
            return "#0"+val.toString(16)+"0"+val.toString(16)+"0"+val.toString(16);
        } else {
            return "#"+val.toString(16)+val.toString(16)+val.toString(16);
        }
    }

    grid.color.fadeColor = function(color, amount) {
        r = componentToHex(Math.floor(amount * color.r));
        g = componentToHex(Math.floor(amount * color.g));
        b = componentToHex(Math.floor(amount * color.b));

        return "#"+r+g+b;
    }



    //console.log(grid.draw.fadeColor("#111111", -1));

    return grid;
}(GRID || {}));