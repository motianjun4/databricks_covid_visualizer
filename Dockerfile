FROM node

WORKDIR /usr/src/app
COPY . .
RUN make build_front

FROM python:3.10.1-bullseye
WORKDIR /usr/src/app
COPY --from=node /usr/src/app .
RUN make install
CMD make run
EXPOSE 8000