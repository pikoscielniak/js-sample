var endOfLine = require('os').EOL;

function print(elem) {
    var accum = [];
    for (var i = 0; i != arguments.length; i++)
        accum.push(String(arguments[i]));
    var joined = accum.join("");
    console.log(joined);
}

function printArray(array) {
    forEach(array, print);
}

function forEach(array, action) {
    for (var i = 0; i < array.length; i++)
        action(array[i]);
}

function show(element) {
    console.log(element);
}

function reduce(combine, base, array) {
    forEach(array, function (element) {
        base = combine(base, element);
    });
    return base;
}

function add(a, b) {
    return a + b;
}

function sum(numbers) {
    return reduce(add, 0, numbers);
}

function negate(func) {
    return function () {
        return !func.apply(null, arguments);
    };
}

function equals(x) {
    return function (element) {
        return x === element;
    };
}

function countZeroes(numbers) {
    return count(equals(0), array);
}

function count(array, test) {
    return reduce(function (total, element) {
        return total + (test(element) ? 1 : 0);
    }, 0, array);
}

function map(func, array) {
    var result = [];
    forEach(array, function (element) {
        result.push(func(element));
    });
    return result;
}

function getParagraphType(header) {
    return (header == 0 ? "p" : "h" + header);
}

function extractFootnotes(paragraphs) {
    var footnotes = [];
    var currentNote = 0;

    function replaceFootnote(fragment) {
        if (fragment.type === "footnote") {
            currentNote++;
            footnotes.push(fragment);
            fragment.number = currentNote;
            return {type: "reference", number: currentNote};
        } else {
            return fragment;
        }
    }

    forEach(paragraphs, function (paragraph) {
        paragraph.content = map(replaceFootnote, paragraph.content);
    });

    return footnotes;
}

function processParagraph(paragraph) {
    var header = 0;
    while (paragraph.charAt(0) === '%') {
        paragraph = paragraph.slice(1);
        header++;
    }
    return {
        content: splitParagraph(paragraph),
        type: getParagraphType(header)
    }
}

function splitParagraph(text) {
    var result = [];

    function indexOrEnd(character) {
        var index = text.indexOf(character);
        return index === -1 ? text.length : index;
    }

    function takeNormal() {
        var end = reduce(Math.min, text.length, map(indexOrEnd, ['*', "{"]));
        var part = text.slice(0, end);
        text = text.slice(end);
        return part;
    }

    function takeUpTo(character) {
        var end = text.indexOf(character, 1);
        if (end == -1) {
            throw new Error("Missing closing '" + character + "'");
        }
        var part = text.slice(1, end);
        text = text.slice(end + 1);
        return part;
    }

    var fragments = [];

    while (text !== "") {
        if (text.charAt(0) === '*') {
            fragments.push({
                type: "emphasised",
                content: takeUpTo("*")
            });
        } else if (text.charAt(0) === "{") {
            fragments.push({
                type: "footnote",
                content: takeUpTo("}")
            });
        } else {
            fragments.push({
                type: "normal",
                content: takeNormal()
            });
        }
    }
    return fragments;
}

function tag(name, content, attributes) {
    return{name: name, attributes: attributes, content: content};
}

function link(target, text) {
    return tag("a", [text], {href: target});
}

function htmlDoc(title, bodyContent) {
    return tag("html", [tag('head', [tag('title', [title])]),
        tag("body", bodyContent)]);
}

function image(src) {
    return tag("img", [], {src: src});
}

function escapeHTML(text) {
    var replacements = [
        [/&/g, "&amp;"],
        [/"/g, "&quot;"],
        [/</g, '&lt;'],
        [/>/g, "&gt;"]
    ];
    forEach(replacements, function (replace) {
        text = text.replace(replace[0], replace[1]);
    });
    return text;
}

function renderHtml(element) {
    var pieces = [];

    function renderAttributes(attributes) {
        var result = [];
        if (attributes) {
            for (var name in attributes) {
                result.push(" " + name + "=\"" + escapeHTML(attributes[name]) + "\"");
            }
        }
        return result.join("");
    }

    function render(element) {
        if (typeof element == "string") {
            pieces.push(escapeHTML(element));
        } else if (!element.content || element.content.length === 0) {
            pieces.push("<" + element.name + renderAttributes(element.attributes) + "/>");
        } else {
            pieces.push("<" + element.name + renderAttributes(element.attributes) + ">");
            forEach(element.content, render);
            pieces.push("</" + element.name + ">");
        }
    }

    render(element);
    return pieces.join("");
}

function execute() {
    var body = [tag("h1", ["The Test"]),
        tag("p", ["Here is a paragraph, and an image..."]),
        image("img/sheep.png")];
    var doc = htmlDoc("The Test", body);
    return renderHtml(doc);
}

function footnote(number) {
    return tag("sup", [link("#footnote" + number, String(number))]);
}

function renderParagraph(paragraph) {
    return tag(paragraph.type, map(renderFragment, paragraph.content));
}

function renderFragment(fragment) {
    if (fragment.type === "reference") {
        return footnote(fragment.number);
    } else if (fragment.type === "emphasised") {
        return tag("em", [fragment.content]);
    } else if (fragment.type === "normal") {
        return fragment.content;
    }
}

function renderFootnote(footnote) {
    var number = "[" + footnote.number + "] ";
    var anchor = tag("a", [number], {name: "footnote" + footnote.number});
    return tag("p", [tag("small", [anchor, footnote.content])]);
}

function renderFile(file, title) {
    var paragraphs = map(processParagraph, file.split(endOfLine + endOfLine));
    var footnotes = map(renderFootnote, extractFootnotes(paragraphs));
    var body = map(renderParagraph, paragraphs).concat(footnotes);
    return renderHtml(htmlDoc(title, body));
}

function asArray(quasiArray, start) {
    var result = [];
    for (var i = (start || 0); i < quasiArray.length; i++) {
        result.push(quasiArray[i]);
    }
    return result;
}

function partial(func) {
    var fixedArgs = asArray(arguments, 1);
    return function () {
        return func.apply(null, fixedArgs.concat(asArray(arguments)));
    }
}

function compose(func1, func2) {
    return function () {
        return func1(func2.apply(null, arguments));
    };
}

var Break = {toString: function () {
    return "Break";
}};

function forEach2(array, action) {
    try {
        for (var i = 0; i < array.length; i++)
            action(array[i]);
    }
    catch (exception) {
        if (exception != Break)
            throw exception;
    }
}

function any(test, array) {
    for (var i = 0; i < array.length; i++) {
        var found = test(array[i]);
        if (found) {
            return found;
        }
    }
    return false;
}

function every(test, array) {
    for (var i = 0; i < array.length; i++) {
        var found = test(array[i]);
        if (!found)
            return found;
    }
    return true;
}

function member(array, value) {
    return any(partial(exports.op["==="], value), array);
}

function flatten(arrays) {
    var result = [];
    forEach(arrays, function (array) {
        forEach(array, function (element) {
            result.push(element);
        });
    });
    return result;
}

function filter(test, array) {
    var result = [];
    forEach(array, function (element) {
        if (test(element)) {
            result.push(element);
        }
    });
    return result;
}

var op = {
    "+": function (a, b) {
        return a + b;
    },
    "==": function (a, b) {
        return a == b;
    },
    "===": function (a, b) {
        return a === b;
    },
    "!": function (a) {
        return !a;
    },
    ">": function (a, b) {
        return a < b;
    }
    /* and so on */
};

function minimise(func, array) {
    var minScore = null;
    var found = null;
    forEach(array, function (element) {
        var score = func(element);
        if (minScore == null || score < minScore) {
            minScore = score;
            found = element;
        }
    });
    return found;
}

function getProperty(propName) {
    return function (object) {
        return object[propName];
    }
}

function forEachIn(object, action) {
    for (var property in object) {
        if (Object.prototype.hasOwnProperty.call(object, property))
            action(property, object[property]);
    }
}

exports.forEach = forEach;
exports.member = member;
exports.print = print;
exports.show = show;
exports.flatten = flatten;
exports.filter = filter;
exports.printArray = printArray;
exports.sum = sum;
exports.map = map;
exports.count = count;
exports.countZeroes = countZeroes;
exports.processParagraph = processParagraph;
exports.splitParagraph = splitParagraph;
exports.renderHtml = renderHtml;
exports.link = link;
exports.execute = execute;
exports.renderFile = renderFile;
exports.any = any;
exports.partial = partial;
exports.every = every;
exports.minimise = minimise;
exports.getProperty = getProperty;
exports.test = function () {
    show(filter(partial(op[">"], 5), [0, 4, 8, 12]));
}
exports.op = op;
exports.forEachIn = forEachIn;