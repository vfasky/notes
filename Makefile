TESTS = test/*.test.js \
        test/model/*.test.js \
        test/route/*.test.js \
        test/api/v1/*.test.js

MOCHA_REPORTER = spec

dev:
	@./node_modules/.bin/node-dev \
	--harmony \
	server.js

jshint:
	@./node_modules/.bin/jshint .

dev-task:
	@./node_modules/.bin/node-dev \
	--harmony \
	task.js

test: 
	@NODE_ENV=test ./node_modules/.bin/mocha \
	--harmony \
	-t 5000 \
	$(TESTS)

install:
	@npm install --registry=http://r.cnpmjs.org

test-cov cov:
	@npm install
	@NODE_ENV=test node --harmony \
	node_modules/.bin/istanbul cover --preserve-comments \
	./node_modules/.bin/_mocha \
	-- \
	--reporter $(MOCHA_REPORTER) \
	-t 5000 \
	$(TESTS) \
	--bail

.PHONY: test
