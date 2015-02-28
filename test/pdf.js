var system = require("system");
var page = require('webpage').create();

page.paperSize = {
  format: "A4",
  orientation: "portrait"
};

page.open('test.html', function() {
  page.render("pdf.pdf");
  phantom.exit();
});

