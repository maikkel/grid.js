/**
 * Created by kelmai on 19/06/14.
 */

var GRID = (function (grid) {
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
        grid.context.rect(
            x * grid.pixelSize + gap, // Position X
            y * grid.pixelSize + gap, // Position Y
            size , // Width
            size  // Height
        );
        grid.context.fillStyle = color;

        grid.context.fill();
    }

    grid.draw.pixelSize = function(x, y, color, pixSize, gap) {

        var size = (grid.pixelSize - gap * 2) * pixSize;
        grid.context.beginPath();
        grid.context.rect(
            x * grid.pixelSize + gap + 0.5 * (grid.pixelSize - gap - size), // Position X
            y * grid.pixelSize + gap + 0.5 * (grid.pixelSize - gap - size), // Position Y
            size , // Width
            size  // Height
        );
        grid.context.fillStyle = color;

        grid.context.fill();
    }

    grid.draw.pixelClear = function(x,y) {
        grid.context.clearRect(
            x * grid.pixelSize,
            y * grid.pixelSize,
            grid.pixelSize,
            grid.pixelSize
        );
    }


    return grid;
}(GRID || {}));