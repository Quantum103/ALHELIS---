package main

import (
	"auth-service/internal/handlers"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()

	r.HandleFunc("api/auth/register", handlers.RegisterUser)
	r.HandleFunc("api/auth/login", handlers.LoginUser)

	http.ListenAndServe(":8081", r)
}
