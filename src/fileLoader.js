var fs = require('fs');

exports.recluseFile = function () {
    return fs.readFileSync("./book.txt").toString();
};