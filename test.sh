#!/bin/bash

#
# Log <type> <msg>
log() {
  local label=$1
  shift
  printf "\x1B[36m%s\x1B[0m :" $label
  printf " \x1B[90m$@\x1B[0m\n"
}

#
# Exit with the given <msg ...>
abort() {
  printf "\n\x1B[31mError: $@\x1B[0m\n\n"
  exit 1
}

# print versions
echo "npm -v"
npm -v
echo

echo "node -v"
node -v
echo

echo "mocha-phantomjs -V"
./node_modules/.bin/mocha-phantomjs -V
echo

node node/build normal || abort "fails to build neuron"
echo 
echo "build : success"

node node/create-jshintrc || abort "fails to create .jshintrc"
echo "jshint: success"
echo

./node_modules/.bin/jshint ./dist/neuron.js || abort "jshint not pass"

# test for node
log "node" "node.js"
./node_modules/.bin/mocha --reporter spec ./test/node.js || abort "unit test for node/neuron.js failed"

for file in `ls -1 test/*.html`; do
  log "test" "$file"
  ./node_modules/.bin/mocha-phantomjs "http://localhost:8030/$file" || abort "unit test for browser/neuron.js failed"
done
