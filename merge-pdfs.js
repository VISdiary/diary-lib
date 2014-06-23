var fs = require("fs");
var exec = require("child_process").exec;
var chalk = require("chalk");

var pdfs =
fs.readdirSync("./output/pdf")
.map(function(name) {
  var match = /(\d+)\.pdf/.exec(name);
  if (match) {
    return parseInt(match[1]);
  }
  else {
    return null;
  }
})
.filter(function(name) {
  return name !== null;
})
.sort(function(a, b) {
  if (a > b) {
    return 1;
  }
  else {
    return -1;
  }
})
.map(function(name) {
  return "./output/pdf/" + name + ".pdf";
});

var command = "pdftk "
+ pdfs.join(" ")
+ " cat output output/diary.pdf";


exec(command, function(err, stdout, stderr) {
  if (err) {
    console.log("Error:", err);
  }
  else {
    console.log(stdout);
    console.log("PDFs merged to output/diary.pdf")
  }
})
