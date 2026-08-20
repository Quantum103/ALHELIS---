package handlers

import (
	"auth-service/internal/models"
	"encoding/json"
	"log"
	"net/http"

	pb "amelli/proto"

	"github.com/jackc/pgx/v5/pgxpool"
)

func NewServer(db *pgxpool.Pool) *Server {
	return &Server{DB: db}
}

type Server struct {
	pb.UnimplementedAlhelisServiceServer
	DB *pgxpool.Pool
}

func (s *Server) HandleLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req models.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error": "Неверный формат данных"}`, http.StatusBadRequest)
		return
	}

	response := map[string]interface{}{
		"token": "temp_token_string",
		"user":  map[string]string{"username": req.Username, "email": "test@test.com"},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (s *Server) HandleRegister(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error": "Неверный формат данных"}`, http.StatusBadRequest)
		return
	}

	response := map[string]string{
		"message": "Аккаунт успешно создан",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func (s *Server) HandleAuthPage(w http.ResponseWriter, r *http.Request) {
	// 1. ДОБАВЛЕНО: Лог, чтобы увидеть запрос в консоли Docker
	log.Println("🚀 ЗАПРОС ПОЛУЧЕН В GO: /auth")

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// 2. ИСПРАВЛЕНО: Абсолютный путь, который мы проверили командой ls
	filePath := "/app/frontend/auth.html"
	log.Printf("📂 Пытаемся открыть файл: %s", filePath)

	http.ServeFile(w, r, filePath)
}
