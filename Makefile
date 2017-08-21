.PHONY: all test clean images ui-upload client-lint mixpanel-report
.DEFAULT_GOAL := all

IMAGE_PREFIX := ui-components-build
UPTODATE := .uptodate
RM := --rm

image: Dockerfile
	docker build -t $(IMAGE_PREFIX) .

lint: image
	$(SUDO) docker run $(RM) -ti \
		-v $(shell pwd)/src:/home/weave/src \
		$(IMAGE_PREFIX) yarn lint

tests:
	$(SUDO) docker run $(RM) -ti \
		-v $(shell pwd)/src:/home/weave/src \
		$(IMAGE_PREFIX) yarn test

release: image
	$(SUDO) docker run $(RM) -ti \
		-v $(shell pwd)/src:/home/weave/src \
		-v $(shell pwd)/docs:/home/weave/docs \
		-v $(shell pwd)/styleguide:/home/weave/styleguide \
		-v $(shell pwd)/dist:/home/weave/dist \
		$(IMAGE_PREFIX) yarn build && \
		npm version patch && \
		git push origin --follow-tags \


docs: release
	$(SUDO) docker run $(RM) -ti \
		-v $(shell pwd)/dist:/home/weave/dist \
		$(IMAGE_PREFIX) yarn s3

shell: image
	$(SUDO) docker run $(RM) -ti \
	$(IMAGE_PREFIX) /bin/bash
