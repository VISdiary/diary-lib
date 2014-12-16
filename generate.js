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

var weeks = require("./weeksDP.json");
var results = [];

console.log("I will be generating", weeks.length, "pages\n");

var days = Handlebars.compile(fs.readFileSync("./templates/days.hbs").toString());
var notes = Handlebars.compile(fs.readFileSync("./templates/notes.hbs").toString());

weeks.forEach(function(week) {
  var weekDays = week.days.map(function(day) {
    if (Array.isArray(day.info)) {
      console.log(day.info.length);
      return {
        multilineInfo: true,
        name: day.name,
        noninfoLines: 9 - day.info.length,
        firstInfo: day.info[0],
        info: day.info.slice(1, day.info.length)
      };
    } else {
      var colouredBackground = false;

      if (day.info === "School Holiday") {
        colouredBackground = true;
      }

      return {
        multilineInfo: false,
        name: day.name,
        noninfoLines: 9,
        colouredBackground: colouredBackground,
        firstInfo: day.info
      };
    }
  });
  var quotes = week.quotes.map(function(quote) {
    if (Array.isArray(quote.text)) {
      return {
        author: quote.author,
        text: quote.text.join("<br />")
      };
    } else {
      return quote;
    }
  });
  week.days = weekDays.slice(0, 3);
  var week2 = {
    days: weekDays.slice(3, 5),
    quotes: quotes
  };
  results.push({
    days: days(week),
    notes: notes(week2)
  });
});

var outputs = [];

results.forEach(function(result) {
  outputs.push(result.days);
  outputs.push(result.notes);
});

console.log("Loaded CSS files:");

fs.readdirSync("./css").forEach(function(file) {
  console.log(file);
  fs.writeFileSync("./output/css/" + file, fs.readFileSync("./css/" + file).toString());
});

console.log("");
console.log("Writing template files...\n");

outputs.forEach(function(result, i) {
  fs.writeFileSync("./output/" + i + ".html", result);
});

console.log("Rendering PDFs with PhantomJS...");

for (var i = 0; i < outputs.length; i++) {
  exec("phantomjs makepdfs.js " + i, writeError);
}


function writeError(err, stdout, stderr) {
  if (err) {
    console.log("uh oh", err);
    console.log(chalk.red("You may need PhantomJS in your PATH"));
  }
}