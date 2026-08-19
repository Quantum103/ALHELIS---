# Этап сборки
FROM golang:1.25-alpine AS builder
WORKDIR /build

# 1. Копируем папку proto и папку сервиса в контейнер
COPY proto ./proto
COPY auth-service ./auth-service

# 2. Переходим в папку сервиса
WORKDIR /build/auth-service

# 3. Скачиваем зависимости (теперь replace ../proto сработает, т.к. папка proto существует)
RUN go mod download
RUN go mod tidy

# 4. Собираем бинарный файл
RUN go build -o app ./cmd/main.go

# Финальный легкий образ
FROM alpine:latest
WORKDIR /app
# Копируем только собранный файл из этапа builder
COPY --from=builder /build/auth-service/app .

# Запуск
CMD ["./app"]