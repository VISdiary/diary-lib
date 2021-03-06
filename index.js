var fs = require("fs");
var crypto = require("crypto");
var exec = require("child_process").exec;
var chalk = require("chalk");
var Handlebars = require("handlebars");
var cheerio = require("cheerio");

// so, this isn't built in...
Handlebars.registerHelper('times', function(n, block) {
    var res = ''; // (html out)
    for (var i = 0; i < n; ++i)
        res += block.fn(i);
    return res;
});

function renderHtml(html, cb) {
  var inputFile = "/tmp/diary-" + crypto.randomBytes(8).toString("hex") + ".html"
  var outputFile = "/tmp/diary-" + crypto.randomBytes(8).toString("hex") + ".pdf"

  fs.writeFile(inputFile, html, function(err) {
    if (err)
      return cb(err, null)

    exec("phantomjs " + __dirname + "/gen-pdf.js " + inputFile + " " + outputFile, function(err, stdout, stderr) {
      if (err) {
        cb(err, null)
      }
      else {
        cb(null, outputFile)
      }
    })
  })
}

function addCss(html, css) {
  var $ = cheerio.load(html);

  var stylesheet = $("<style>").html("\n" + css + "\n")
  $("head").append(stylesheet)

  return $.html()
}

function generate(input, cb) {
  // results = rendered HTML files
  var results = [];

  var weeks = input.weeks;
  var templates = input.templates;
  var stylesheets = input.css;

  // add the right stylesheets to each HTML file 
  var daysHtml = addCss(templates["days"], stylesheets["days"]);
  var notesHtml = addCss(templates["notes"], stylesheets["notes"]);

  var days = Handlebars.compile(daysHtml);
  var notes = Handlebars.compile(notesHtml);

  weeks.forEach(function(week) {
    var weekDays = week.days.map(function(day) {
      if (Array.isArray(day.info)) {
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

  var files = []
  pages.forEach(function(page, i) {
    renderHtml(page, function(err, res) {
      if (err) {
        cb(err, null)
      }
      files.push(res)

      if (files.length === pages.length) {
        var diaryPdf = "/tmp/" + crypto.randomBytes(8).toString("hex") + ".pdf"
        exec("gs -dNOPAUSE -sDEVICE=pdfwrite -sOUTPUTFILE=" + diaryPdf + " -dBATCH " + files.join(" "), function(err, stdout, stderr) {
          if (err) {
            cb(err, null)
            console.log("error", err)
          }
          cb(null, diaryPdf)
        })
      }
    })
  });
}


module.exports.generate = generate
