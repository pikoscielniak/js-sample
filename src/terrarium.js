var utils = require('./utils');

var grid = [
    ["0,0", "1,0", "2,0"],
    ["0,1", "1,1", "2,1"]
];

var thePlan =
    ["############################",
        "#      #    #      o      ##",
        "#                          #",
        "#          #####           #",
        "##         #   #    ##     #",
        "###           ##     #     #",
        "#           ###      #     #",
        "#   ####                   #",
        "#   ##       o             #",
        "# o  #         o       ### #",
        "#    #                     #",
        "############################"];

function Point(x, y) {
    this.x = x;
    this.y = y;
}
Point.prototype.add = function (other) {
    return new Point(this.x + other.x, this.y + other.y);
};
Point.prototype.isEqualTo = function (other) {
    return this.x == other.x && this.y == other.y;
};

exports.test = function () {
    utils.show((new Point(3, 1)).add(new Point(2, 4)));
};

function Grid(width, height) {
    this.width = width;
    this.height = height;
    this.cells = new Array(width * height);
}

Grid.prototype.valueAt = function (point) {
    return this.cells[point.y * this.width + point.x];
};

Grid.prototype.setValueAt = function (point, value) {
    this.cells[point.y * this.width + point.x] = value;
};

Grid.prototype.isInside = function(point){
  return point.x >= 0 && point.y >= 0 &&
      point.x < this.width && point.y < this.height;
};

Grid.prototype.moveValue = function(from, to) {
    this.setValueAt(to, this.valueAt(from));
    this.setValueAt(from, undefined);
};

Grid.prototype.each = function(action) {
    for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
            var point = new Point(x, y);
            action(point, this.valueAt(point));
        }
    }
};