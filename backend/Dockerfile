FROM docker.io/paritytech/ci-linux:production as builder

RUN mkdir /build
COPY . /build

RUN cd /build \
    && cargo build --release

FROM docker.io/library/ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive \
    RUST_LOG=info

RUN mkdir /app \
    && apt update -y \
    && apt install -y --no-install-recommends libssl1.1 libssl-dev
WORKDIR /app
COPY --from=builder --chown=nobody:nobody /build/target/release/backend /app/backend

ENTRYPOINT [ "/app/backend" ]

