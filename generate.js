// Uhm...
var fs = require("fs");
var Handlebars = require("handlebars");

// so, this isn't built in...
Handlebars.registerHelper('times', function(n, block) {
    var res = ''; // (html out)
    for (var i = 0; i < n; ++i)
        res += block.fn(i);
    return res;
});

var weeks = require("./weeks.json");
var results = [];

var days = Handlebars.compile(fs.readFileSync("./days.hbs").toString());
var notes = Handlebars.compile(fs.readFileSync("./notes.hbs").toString())

weeks.forEach(function(week) {
  results.push({
    days: days(week),
    notes: notes()
  });
});

console.log(results);
