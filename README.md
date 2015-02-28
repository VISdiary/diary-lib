diary-lib
=====

The diary madness

## Dependencies

* Node.js
* [PhantomJS](http://phantomjs.org/)
* Ghostscript

## Usage

```javascript
var diary = require("diary-lib")
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

diary.generate({
  weeks: weeks,
  templates: templates,
  css: css
}, function(err, result) {
  if (err) {
    console.log("error", err)
    process.exit(1)
  }

  fs.createReadStream(result).pipe(fs.createWriteStream("./result.pdf"))
})


```
