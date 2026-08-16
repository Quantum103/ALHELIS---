FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o app ./cmd/main.go

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/app .
EXPOSE 8083
CMD ["./app"]