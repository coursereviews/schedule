SHELL := /bin/bash

MOCHA = node_modules/.bin/mocha
NPM = npm
NODE = node
BOWER = node_modules/.bin/bower
JSCS = node_modules/.bin/jscs --esnext --config ...
JSHINT = node_modules/.bin/jshint --config ...
REPORTER = list
ISTANBUL = node --harmony node_modules/.bin/istanbul
JSCS = node_modules/.bin/jscs --esnext --config $(DEV_TOOLS)/jscs.json
JSHINT = node_modules/.bin/jshint --extract=auto
JSHINT_NODE = $(JSHINT) --config $(DEV_TOOLS)/jshint-node.json
JSHINT_BROWSER = $(JSHINT) --config $(DEV_TOOLS)/jshint-browser.json
MOCHA_OPTS = --ui bdd -c

SRC = ./*.js

SRC_NODE    = $(shell find . \( -path './lib/*' -or -path './test/*' \) \
 								-not -path './test/fixtures/*' -name '*.js')
SRC_ALL = $(SRC_NODE) $(SRC_BROWSER)

.PHONY: start
start:
	$(NPM) start

.PHONY: setup
setup: setup-dependencies

.PHONY: setup-dependencies
setup-dependencies:
	$(NPM) install
	$(BOWER) install


.PHONY: clean
clean:
	$(NPM) rm -rf public/vendor && rm -rf node_modules


.PHONY: lint
lint:
	@$(JSHINT_NODE) -- $(SRC_NODE)
	@$(DEV_TOOLS)/bin/check-use-strict $(SRC_NODE)
	@$(DEV_TOOLS)/bin/check-comments $(SRC_NODE)
	@$(JSCS) -- $(SRC_NODE)


.PHONY: test
test:
	@$(NODE) --harmony --reporter $(REPORTER) $(MOCHA_OPTS) tests/*.js
