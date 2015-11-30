SHELL := /bin/bash

NPM = npm
NODE = node
BOWER = node_modules/.bin/bower
KNEX_CLI = node_modules/.bin/knex/lib/bin/cli.js
JSCS = node_modules/.bin/jscs --esnext --config ./.jscsrc
JSHINT_NODE = node_modules/.bin/jshint --extract=auto --config ./.jshintrc
ISTANBUL = node --harmony node_modules/.bin/istanbul
MOCHA = node_modules/.bin/mocha
MOCHA_OPTS = --ui bdd -c

SRC = ./*.js

SRC_NODE    = $(shell find . \( -path './lib/*' -or -path './tests/*' \) \
 								-not -path './lib/views/*')
SRC_BROWSER = $(shell find . -path './public/*' \( -name '*.js' -or -name '*.html' \))


.PHONY: start
start:
	$(NPM) start

.PHONY: setup
setup: setup-dependencies


.PHONY: setup-dependencies
setup-dependencies:
	$(NPM) install
	$(BOWER) install
	$(KNEX_CLI) migrate:latest --knexfile lib/settings/knexfile.js


.PHONY: clean
clean:
	$(NPM) rm -rf public/vendor && rm -rf node_modules


.PHONY: lint
lint:
	@$(JSHINT_NODE) -- $(SRC_NODE)
	@$(JSCS) -- $(SRC_NODE)


.PHONY: test
test:
	$(ISTANBUL) cover node_modules/.bin/_mocha --recursive
	#$(ISTANBUL) check-coverage --branches 100
