all: build

build:
	yarn --production --pure-lockfile
	yarn build

run:
	PORT=4002 node server.js
