// Uhm...
var fs = require("fs");
var exec = require("child_process").exec;
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
var notes = Handlebars.compile(fs.readFileSync("./notes.hbs").toString());

weeks.forEach(function(week) {
  results.push({
    days: days(week),
    notes: notes() // Yeah, it is static, but it could be customized...
  });
});

results.forEach(function(result, i) {
  fs.writeFileSync("./output/" + i + ".html", result.days);
});

fs.writeFileSync("./output/notes.html", results[0].notes);

/*
for (var i = 0; i < results.length; i++) {
  exec("phantomjs makepdfs.js" + i, )
}

zZZZ for now...
*/
