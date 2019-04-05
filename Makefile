compile:
	yarn exec tsc

run: compile
	SHOW_ALL=true yarn exec node server.js

build: compile
	docker build -t webdestroya/http-placeholder:latest .

push:
	docker push webdestroya/http-placeholder:latest

release: build push