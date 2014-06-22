var system = require("system");
var page = require('webpage').create();

page.paperSize = {
  format: "A4",
  orientation: "portrait"
};

page.open('http://localhost:7472/' + system.args[1] + ".html", function() {
  page.render("output/pdf/" + system.args[1] + ".pdf");
  phantom.exit();
});
