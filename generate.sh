#!/bin/sh

mkdir -p output/css
mkdir -p output/pdf

./node_modules/.bin/http-server output -p 7472 &> ./output/server-blabla.log &

node generate.js

kill $!

node merge-pdfs.js
