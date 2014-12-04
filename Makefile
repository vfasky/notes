TESTS = test/*.test.js

dev:
	@./node_modules/.bin/node-dev \
	--harmony \
	server.js

test:
	@./node_modules/.bin/mocha \
	--harmony \
	$(TESTS)

install:
	@npm install --registry=http://r.cnpmjs.org

.PHONY: test