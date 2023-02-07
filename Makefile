.PHONY: build install
build: install
	npm run build

install:
	npm ci
