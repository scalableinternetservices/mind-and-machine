.PHONY: build run run-detach start stop clean

# build docker image
build:
	docker compose build web
	cd react && docker compose build

start:
	docker compose up --detach db --remove-orphans
	docker compose run web rails db:create db:migrate
	docker compose up

# run docker-compose
run: bundle build start

bundle:
	docker run --rm -v $(PWD):/app -w /app ruby:3.2.2 bundle install
	export DOCKER_DEFAULT_PLATFORM=linux/amd64

# run docker-compose in detach mode
run-detach: build
	docker compose up -d

# stop docker-compose
stop:
	docker compose down

# clean docker image
clean:
	docker rmi mind-and-machine-ruby mind-and-machine-react