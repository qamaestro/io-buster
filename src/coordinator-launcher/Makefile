NODE_VERSION := 10
INSTALL_PATH = ../../bin/coordinator/
all: macos win linux

setup:
	npm install -g pkg
	npm install

macos: setup
	mkdir -p $(INSTALL_PATH)$@
	pkg -t node$(NODE_VERSION)-$@-x64 index.js -o $(INSTALL_PATH)$@/iobc

win: setup
	mkdir -p $(INSTALL_PATH)$@
	pkg -t node$(NODE_VERSION)-$@-x64 index.js -o $(INSTALL_PATH)$@/iobc

linux: setup
	mkdir -p $(INSTALL_PATH)$@
	pkg -t node$(NODE_VERSION)-$@-x64 index.js -o $(INSTALL_PATH)$@/iobc

clean:
	rm -rf out/
	rm -rf node_modules/

.PHONY: all setup macos win linux
