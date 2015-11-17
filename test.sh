#!/bin/bash

#
# Log <type> <msg>
#

log() {
  printf "\033[36m%s\033[0m : \033[90m%s\033[0m\n" $1 $2
}

#
# Exit with the given <msg ...>
#

abort() {
  printf "\n\033[31mError: $@\033[0m\n\n" && exit 1
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
