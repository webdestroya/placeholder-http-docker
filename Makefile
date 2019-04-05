compile:
	yarn exec tsc

run: compile
	yarn exec node server.js nothing

build: compile
	docker build -t webdestroya/http-placeholder:latest .

push:
	docker push webdestroya/http-placeholder:latest

release: build push

docker-run: build
	docker run --rm -p 8080:8080 webdestroya/http-placeholder:latest