package grpcserver

import "github.com/jackc/pgx/v5/pgxpool"

type Server struct {
	authpb.UnimplementedAuthServiceServer
	pool      *pgxpool.Pool // Пул подключений к БД
	jwtSecret []byte
}

func NewServer(pool *pgxpool.Pool, jwtSecret []byte) *Server {
	return &Server{
		pool:      pool,
		jwtSecret: jwtSecret,
	}
}
