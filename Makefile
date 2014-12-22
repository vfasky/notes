TESTS = test/*.test.js \
        test/model/*.test.js \
        test/route/*.test.js \
        test/api/v1/*.test.js

MOCHA_REPORTER = spec

dev:
	@./node_modules/.bin/node-dev \
	--harmony \
	server.js

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
	--harmony \
	$(TESTS)

install:
	@npm install --registry=http://r.cnpmjs.org

test-cov cov:
	@npm install 
	@NODE_ENV=test node --harmony-generators \
	node_modules/.bin/istanbul cover --preserve-comments \
	./node_modules/.bin/_mocha \
	-- \
	--reporter $(MOCHA_REPORTER) \
	$(TESTS) \
	--bail

.PHONY: test