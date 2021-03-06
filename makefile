SHELL := /bin/bash

NPM = npm
NODE = node
BOWER = node_modules/.bin/bower
JSCS = node_modules/.bin/jscs --esnext --config ./.jscsrc
JSHINT_NODE = node_modules/.bin/jshint --extract=auto --config ./.jshintrc
ISTANBUL = node --harmony node_modules/.bin/istanbul
MOCHA = node --harmony node_modules/.bin/_mocha
SRC = ./*.js
SRC_NODE    = $(shell find . \( -path './lib/*' -or -path './tests/*' \) -not -path './lib/views/*')
SRC_BROWSER = $(shell find . -path './public/*' \( -name '*.js' -or -name '*.html' \))
SRC_TEST = $(shell find test -name '*.js' -not -name 'catalog.js' -not -name 'favorite.js')
SRC_TEST_CATALOG = ./test/routes/catalog.js
SRC_TEST_FAVORITE = ./test/routes/favorite.js



.PHONY: start
start:
	$(NPM) start


.PHONY: setup
setup: setup-dependencies setup-migrations setup-catalog


.PHONY: setup-migrations
setup-migrations:
	$(NPM) run migrate:latest


.PHONY: setup-dependencies
setup-dependencies:
	$(NPM) install
	$(BOWER) install


.PHONY: setup-catalog
setup-catalog:
	@echo 'scraping catalog for Spring (201620)'
	$(NODE) --harmony ./lib/scripts/scrape_catalog.js 201620

.PHONY: clean
clean:
	$(NPM) rm -rf public/vendor && rm -rf node_modules


.PHONY: lint
lint:
	@$(JSHINT_NODE) -- $(SRC_NODE)
	@$(JSCS) -- $(SRC_NODE)


.PHONY: test
test: test-basic test-catalog test-favorite


test-basic:
	$(MOCHA) $(SRC_TEST)


test-catalog:
	$(MOCHA) $(SRC_TEST_CATALOG)


test-favorite:
	$(MOCHA) $(SRC_TEST_FAVORITE)
