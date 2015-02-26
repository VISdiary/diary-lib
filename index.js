var fs = require("fs");
var exec = require("child_process").exec;
var chalk = require("chalk");
var Handlebars = require("handlebars");
var cheerio = require("cheerio")

// so, this isn't built in...
Handlebars.registerHelper('times', function(n, block) {
    var res = ''; // (html out)
    for (var i = 0; i < n; ++i)
        res += block.fn(i);
    return res;
});

function addCss(html, css) {
  var $ = cheerio.load(html);

  var stylesheet = $("<style>").html(css)
  $("head").append(stylesheet)

  return $.html()
}

function generate(input) {
  // results = rendered HTML files
  var results = [];

  var weeks = input.weeks;
  var templates = input.templates;
  var stylesheets = input.css;

  var daysHtml = addCss(templates["days"], stylesheets["days"]);
  var notesHtml = addCss(templates["notes"], stylesheets["notes"]);

  var days = Handlebars.compile(daysHtml);
  var notes = Handlebars.compile(notesHtml);

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
      }
      else {
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
    })
    var quotes = week.quotes.map(function(quote) {
      if (Array.isArray(quote.text)) {
        return {
          author: quote.author,
          text: quote.text.join("<br />")
        }
      }
      else {
        return quote;
      }
    })

    week.days = weekDays.slice(0, 3);
    var week2 = {
      days: weekDays.slice(3, 5),
      quotes: quotes
    }
    results.push({
      days: days(week),
      notes: notes(week2)
    });
  })

  var pages = [];

  results.forEach(function(result) {
    pages.push(result.days);
    pages.push(result.notes);
  })

  fs.readdirSync("./css").forEach(function(file) {
    console.log(file);
    fs.writeFileSync("./output/css/" + file, fs.readFileSync("./css/" + file).toString());
  })

  console.log("");
  console.log("Writing template files...\n");

  pages.forEach(function(result, i) {
    fs.writeFileSync("./output/" + i + ".html", result);
  });

  console.log("Rendering PDFs with PhantomJS...");

  for (var i = 0; i < pages.length; i++) {
    exec("phantomjs makepdfs.js " + i, function(err, stdout, stderr) {
      if (err) {
        console.log("uh oh", err);
        console.log(chalk.red("You may need PhantomJS in your PATH"));
      }
    });
  }

}


module.exports.generate = generate
