FROM golang:1.25-alpine AS builder
WORKDIR /build

COPY proto ./proto
COPY user-service ./user-service

WORKDIR /build/user-service
RUN go mod download
RUN go mod tidy
RUN go build -o app ./cmd/main.go # (или как у тебя называется main файл)

FROM alpine:latest
WORKDIR /app
COPY --from=builder /build/user-service/app .
CMD ["./app"]