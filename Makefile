.PHONY: all test clean images ui-upload client-lint

PKG_VERSION := $(shell cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g')
