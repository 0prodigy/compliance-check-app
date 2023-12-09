APP_PORT ?= 3000

.PHONY: build
build:
	docker build -t cca .

.PHONY: start
start:
	docker run -d -p $(APP_PORT):$(APP_PORT) --name cca cca

.PHONY: stop
stop:
	docker stop cca
	docker rm  cca