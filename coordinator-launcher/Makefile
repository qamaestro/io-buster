NODE_VERSION := 10

all: macos win linux

setup:
	npm install -g pkg
	npm install

macos: setup
	mkdir -p ../bin/$@
	pkg -t node$(NODE_VERSION)-$@-x64 index.js -o ../bin/$@/iobc

win: setup
	mkdir -p ../bin/$@
	pkg -t node$(NODE_VERSION)-$@-x64 index.js -o ../bin/$@/iobc

linux: setup
	mkdir -p ../bin/$@
	pkg -t node$(NODE_VERSION)-$@-x64 index.js -o ../bin/$@/iobc

clean:
	rm -rf out/
	rm -rf node_modules/

.PHONY: all setup macos win linux
