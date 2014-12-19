// Uhm...
var fs = require("fs"),
  exec = require("child_process").exec,
  Handlebars = require("handlebars"),
  chalk = require("chalk"),
  os = require("os"),
  path = require("path");

var TEMPDIR = path.join(os.tmpDir(), "diaryTemps");

// so, this isn't built in...
Handlebars.registerHelper('times', function(n, block) {
  var res = ''; // (html out)
  for (var i = 0; i < n; ++i)
    res += block.fn(i);
  return res;
});

module.exports = function(weeks, tempdir) {
  if (typeof tempdir !== "undefined") {
    TEMPDIR = tempdir;
  }
  return new DiaryPDF(weeks);
};

function DiaryPDF(weeks) {
  this.weeks = weeks; // JSON describing the year
  this.results = [];
  this.outputs = [];
}

DiaryPDF.prototype.renderHTML = function() {
  var self = this;
  var days = Handlebars.compile(fs.readFileSync("./templates/days.hbs").toString());
  var notes = Handlebars.compile(fs.readFileSync("./templates/notes.hbs").toString());

  self.weeks.forEach(function(week) {
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
    self.results.push({
      days: days(week),
      notes: notes(week2)
    });
  });
};

DiaryPDF.prototype.getOutputs = function() {
  var self = this;
  self.results.forEach(function(result) {
    self.outputs.push(result.days);
    self.outputs.push(result.notes);
  });
};

DiaryPDF.prototype.copyCssFiles = function() {
  fs.readdirSync("./css/").forEach(function(file) {
    console.log(file);
    fs.writeFileSync(path.join(TEMPDIR, "css", file), fs.readFileSync("./css/" + file).toString());
  });
};

DiaryPDF.prototype.outputHtml = function() {
  this.outputs.forEach(function(result, i) {
    fs.writeFileSync(path.join(TEMPDIR, i, ".html"), result);
  });
};

DiaryPDF.prototype.renderPDF = function() {
  for (var i = 0; i < outputs.length; i++) {
    exec("phantomjs makepdfs.js " + i, writeError);
  }
};

function writeError(err, stdout, stderr) {
  if (err) {
    console.log("uh oh", err);
    console.log(chalk.red("You may need PhantomJS in your PATH"));
  }
}