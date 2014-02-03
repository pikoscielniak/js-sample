var utils = require('./utils');
function Rabbit(adjective) {
    this.adjective = adjective;
    this.speak = function (line) {
        utils.print("The ", this.adjective, " rabbit says '", line, "'");
    };
}

function makeRabbit(adjective) {
    return {
        adjective: adjective,
        speak: function (line) {/*etc*/
        }
    };
}

function test() {
    var blackRabbit = makeRabbit("black");
    var killerRabbit = new Rabbit("killer");
    killerRabbit.speak("GRAAAAAAAAAH!");
    utils.show(killerRabbit.constructor);
    utils.show(blackRabbit.constructor);
    utils.show(killerRabbit.__proto__.constructor);
}

function test2() {
    utils.show(Rabbit.constructor);
    utils.show(Rabbit.prototype);
    utils.show(Rabbit.prototype.constructor);
    utils.show(Rabbit === Rabbit.prototype.constructor);
    utils.show(Rabbit.constructor === Rabbit.prototype.constructor.constructor);
}

function test3() {
    var killerRabbit = new Rabbit("killer");
    var newRabbit = new killerRabbit.constructor("test");
    newRabbit.speak('ddd');
}

function test4() {
    var killerRabbit = new Rabbit("killer");
    Rabbit.prototype.teeth = "small";
    utils.show(killerRabbit.teeth);
    killerRabbit.teeth = "long, sharp, and bloody";
    utils.show(killerRabbit.teeth);
    utils.show(Rabbit.prototype.teeth);
}

function test5() {
    Object.prototype.properties = function () {
        var result = [];
        for (var property in this)
            if (this.hasOwnProperty(property))
                result.push(property);
        return result;
    };

    var test = {x: 10, y: 3};
    utils.show(test.properties());
}

function test6() {
    utils.show(Object);
    utils.show(Rabbit);
    utils.show('---------------');
    utils.show(Object.prototype);
    utils.show(Rabbit.prototype);
    console.dir(Object.prototype);
    console.dir(Rabbit.prototype);
    utils.show(Object.prototype === Rabbit.prototype);
    utils.show('---------------');
    utils.show(Object.constructor);
    utils.show(Rabbit.constructor);
    utils.show('---------------');
    utils.show(Object.prototype.constructor);
    utils.show(Rabbit.prototype.constructor);
}

exports.test = test6;