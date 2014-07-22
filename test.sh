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

node node/build || abort "fails to build neuron"
node node/create-jshintrc || abort "fails to create .jshintrc"
echo

./node_modules/.bin/jshint ./dist/neuron.js || abort "jshint not pass"

for file in `ls -1 test/*.html`; do
  log "test" "$file"
  ./node_modules/.bin/mocha-phantomjs "$file"
done
