TEST_FILES = \
		tests/test.js


.PHONY: tests

tests:
	node_modules/whiskey/bin/whiskey --tests "${TEST_FILES}"
