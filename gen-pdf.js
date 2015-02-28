var system = require("system");
var page = require('webpage').create();

page.paperSize = {
  format: "A4",
  orientation: "portrait"
};

page.open(system.args[1], function() {
  page.render(system.args[2]);
  phantom.exit();
});
