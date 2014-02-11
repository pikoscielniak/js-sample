var utils = require('./utils');

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