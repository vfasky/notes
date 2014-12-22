TESTS = test/*.test.js \
        test/model/*.test.js \
        test/route/*.test.js

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
	node_modules/.bin/istanbul cover \
	./node_modules/.bin/_mocha \
	--report lcovonly \
	-- -u exports \
	$(TESTS) \
	--bail

.PHONY: test