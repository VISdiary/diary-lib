// Uhm...
var fs = require("fs");
var exec = require("child_process").exec;
var Handlebars = require("handlebars");
var chalk = require("chalk");

// so, this isn't built in...
Handlebars.registerHelper('times', function(n, block) {
    var res = ''; // (html out)
    for (var i = 0; i < n; ++i)
        res += block.fn(i);
    return res;
});

console.log(chalk.green("Hello, you there"), chalk.magenta(":)"));
console.log(chalk.cyan("Let's make a diary! \n"));

var weeks = require("./weeks.json");
var results = [];

console.log("I will be generating", weeks.length, "pages\n");

var days = Handlebars.compile(fs.readFileSync("./templates/days.hbs").toString());
var notes = Handlebars.compile(fs.readFileSync("./templates/notes.hbs").toString());

weeks.forEach(function(week) {
  results.push({
    days: days(week),
    notes: notes() // Yeah, it is static, but it could be customized...
  });
});

console.log("Loaded CSS files:");

fs.readdirSync("./css").forEach(function(file) {
  console.log(file);
  fs.writeFileSync("./output/css/" + file, fs.readFileSync("./css/" + file).toString());
})

console.log("");
console.log("Writing template files...\n");

results.forEach(function(result, i) {
  fs.writeFileSync("./output/" + i + ".html", result.days);
});

fs.writeFileSync("./output/notes.html", results[0].notes); // just one

console.log("Rendering PDFs with PhantomJS...");

for (var i = 0; i < results.length; i++) {
  exec("phantomjs makepdfs.js " + i, function(err, stdout, stderr) {
    if (err) {
      console.log("uh oh", err);
      console.log(chalk.red("You may need PhantomJS in your PATH"));
    }
    else {
      //console.log(stdout);
    }
  });
}
