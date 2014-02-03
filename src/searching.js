var utils = require('./utils');

var roads = {};

function makeRoad(from, to, length) {
    function addRoad(from, to) {
        if (!(from in roads)) {
            roads[from] = [];
        }
        roads[from].push({to: to, distance: length});
    }

    addRoad(from, to);
    addRoad(to, from);
}

function makeRoads(start) {
    for (var i = 1; i < arguments.length; i += 2) {
        makeRoad(start, arguments[i], arguments[i + 1]);
    }
}

function addRoads() {
    makeRoads("Point Kiukiu", "Hanaiapa", 19,
        "Mt Feani", 15, "Taaoa", 15);
    makeRoads("Airport", "Hanaiapa", 6, "Mt Feani", 5,
        "Atuona", 4, "Mt Ootua", 11);
    makeRoads("Mt Temetiu", "Mt Feani", 8, "Taaoa", 4);
    makeRoads("Atuona", "Taaoa", 3, "Hanakee pearl lodge", 1);
    makeRoads("Cemetery", "Hanakee pearl lodge", 6, "Mt Ootua", 5);
    makeRoads("Hanapaoa", "Mt Ootua", 3);
    makeRoads("Puamua", "Mt Ootua", 13, "Point Teohotepapapa", 14);
}

function displayRoads(name) {
    utils.show(roads[name]);
}

function roadsFrom(place) {
    var found = roads[place];
    if (found == undefined) {
        throw new Error("No place named '" + place + "' found.");
    } else {
        return found;
    }
}

function gamblerPath(from, to) {
    function randomInteger(below) {
        return Math.floor(Math.random() * below);
    }

    function randomDirection(from) {
        var options = roadsFrom(from);
        return options[randomInteger(options.length)].to;
    }

    var path = [];
    while (true) {
        path.push(from);
        if (from == to) {
            break;
        }
        from = randomDirection(from);
    }
    return path;
}

function possibleRoutes(from, to) {
    function findRoutes(route) {
        function notVisited(road) {
            return !utils.member(route.places, road.to);
        }

        function continueRoute(road) {
            return findRoutes({places: route.places.concat([road.to]),
                length: route.length + road.distance});
        }

        var end = route.places[route.places.length - 1];
        if (end == to) {
            return [route];
        } else {
            return utils.flatten(utils.map(continueRoute, utils.filter(notVisited, roadsFrom(end))));
        }
    }

    return findRoutes({places: [from], length: 0});
}

function shortestRoute(from, to) {
    return utils.minimise(utils.getProperty("length"), possibleRoutes(from, to));
}

exports.addRoads = addRoads;
exports.displayRoads = displayRoads;
exports.roadsFrom = roadsFrom;
exports.gamblerPath = gamblerPath;
exports.test = function () {
    addRoads();
    utils.show(shortestRoute("Point Kiukiu", "Point Teohotepapapa").places);
};