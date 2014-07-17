#!/bin/bash

for file in `ls -1 test/*.html`; do
  echo ">>>> test $file"
  ./node_modules/.bin/mocha-phantomjs "$file"
done
