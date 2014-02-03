var utils = require('./utils');

function heightAt(x, y) {
    return Math.floor(Math.random() * 401);
}

function point(x, y) {
    return {x: x, y: y};
}

function addPoints(a, b) {
    return point(a.x + b.x, a.y + b.y);
}

function samePoint(a, b) {
    return a.x == b.x && a.y == b.y;
}

function possibleDirections(from) {
    var mapSize = 20;

    function insideMap(point) {
        return point.x >= 0 && point.x < mapSize &&
            point.y >= 0 && point.y < mapSize;
    }

    var directions = [point(-1, 0), point(1, 0), point(0, -1),
        point(0, 1), point(-1, -1), point(-1, 1),
        point(1, 1), point(1, -1)];

    return utils.filter(insideMap, utils.map(utils.partial(addPoints, from), directions));
}

function weightedDistance(pointA, pointB) {
    var heightDifference = heightAt(pointA, pointB);
    var climbFactor = (heightDifference < 0 ? 1 : 2);
    var flatDistance = (pointA.x == pointB.x || pointA.y == pointB.y ? 100 : 141);
    return flatDistance + climbFactor * Math.abs(heightDifference);
}

exports.test = function () {
    utils.show(possibleDirections(point(0, 0)));
};