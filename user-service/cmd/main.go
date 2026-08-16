package main

import (
	"net/http"
	"user-service/internal/handlers"

	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/dashboard", handlers.DashboardFunc)

	http.ListenAndServe(":8082", r)
}
