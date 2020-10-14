.PHONY: all
all: build

.PHONY: build
build:
	yarn build

.PHONY: by_docker
by_docker:
	@docker run --rm --privileged multiarch/qemu-user-static --reset -p yes
	@docker buildx build --no-cache\
		-t emqx-dashboard-frontend\
		--platform=linux/amd64 \
		--output type=tar,dest=build_by_docker.tar .
	@tar -xvf build_by_docker.tar --wildcards emqx-dashboard-frontend/dist \
	&& mv emqx-dashboard-frontend/dist . \
	&& rm -rf build_by_docker.tar emqx-dashboard-frontend

.PHONY: clean
clean:
	@rm -rf dist
