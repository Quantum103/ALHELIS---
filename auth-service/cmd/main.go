package main

import (
	"auth-service/internal/database"
	"log"
	"net"

	"github.com/jackc/pgx/v5/pgxpool"
	"google.golang.org/grpc"

	pb "amelli/proto"
)

type server struct {
	pb.UnimplementedAlhelisServiceServer
	db *pgxpool.Pool
}

func main() {
	dbConfig := database.Config{
		Host:     "postgres_db",
		Port:     "5432",
		User:     "coffee_user",
		Password: "coffee_password",
		DBName:   "menu_db",
	}

	db, err := database.NewPostgresPool(dbConfig)
	if err != nil {
		log.Fatalf("Ошибка подключения к БД: %v", err)
	}
	defer db.Close()

	lis, err := net.Listen("tcp", ":50052")
	if err != nil {
		log.Fatalf("Не удалось запустить сервер: %v", err)
	}

	grpcServer := grpc.NewServer()
	pb.RegisterAlhelisServiceServer(grpcServer, &server{db: db})

	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("Ошибка работы сервера: %v", err)
	}
}
