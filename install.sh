#!/bin/bash

# check if a command is already exists
# syntax
# test_exists [command]
test_exists(){
    command -v $1 >/dev/null 2>&1 || {

    	# >&2 redirect all output to stderr
        echo >&2 "Command $1 is not found."
        exit 1
    }

    type $1 >/dev/null 2>&1 || { 
        echo >&2 "Command $1 is not found."
        exit 1
    }

    hash $1 2>/dev/null || { 
        echo >&2 "Command $1 is not found."
        exit 1
    }
}

ERROR_NODE_MISSING="Error: npm is required. visit http://nodejs.org, install it, and try again"

test_exists node || {
	echo >&2 $ERROR_NODE_MISSING
	exit 1
}

test_exists npm || {
	echo >&2 $ERROR_NODE_MISSING
	exit 1
}

test_exists neuron || {
	npm install nervecentre -g
}

echo "Installation completed!"
echo "Usage:"
echo "--------------------------"

neuron
