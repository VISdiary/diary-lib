var lib = require("../index.js")
var fs = require("fs")

var weeks = require("./weeks.json")

var templates = {
  "days": fs.readFileSync("./templates/days.hbs").toString(),
  "notes": fs.readFileSync("./templates/notes.hbs").toString()
}

var css = {
  "days": fs.readFileSync("./css/days.css").toString(),
  "notes": fs.readFileSync("./css/notes.css").toString()
}

lib.generate({weeks: weeks, templates: templates, css: css}, function(err, result) {
  fs.writeFile("./result.pdf", result)
})
