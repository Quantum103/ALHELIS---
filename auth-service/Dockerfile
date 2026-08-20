FROM golang:1.25-alpine AS builder
WORKDIR /build

COPY proto ./proto
COPY auth-service ./auth-service
COPY frontend ./frontend  

WORKDIR /build/auth-service

RUN go mod download
RUN go mod tidy
RUN go build -o app ./cmd/main.go

FROM alpine:latest
WORKDIR /app

COPY --from=builder /build/auth-service/app .
COPY --from=builder /build/frontend ./frontend

EXPOSE 8080 50052
CMD ["./app"]