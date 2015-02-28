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

## How it works

1. The diary data in its specific format (`weeks.json`) is passed to the generator along with
  CSS files and templates for the two types of pages.
2. The Handlebars templates are created with the data inserted in the right places, and the CSS is added
  into the HTML.
3. The HTML files are written into temporary files, which are then converted to PDF files by a PhantomJS script `gen-pdf.js`
4. Ghostscript (which is somewhat lightweight and pretty common) is used to merge all PDFs into one.
