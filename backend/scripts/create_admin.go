package main

import (
	"fmt"
	"log"

	"github.com/3wg/vpn-backend/config"
	"github.com/3wg/vpn-backend/database"
	"github.com/3wg/vpn-backend/models"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Initialize configuration
	cfg := config.Load()

	// Connect to database
	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Check if admin already exists
	var existingAdmin models.User
	if err := db.Where("email = ?", "admin@3wg.ru").First(&existingAdmin).Error; err == nil {
		log.Println("Admin user already exists")
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal("Failed to hash password:", err)
	}

	// Create admin user
	admin := models.User{
		Email:        "admin@3wg.ru",
		PasswordHash: string(hashedPassword),
		Balance:      0,
		Tariff:       "admin",
		IsAdmin:      true,
		IsActive:     true,
	}

	if err := db.Create(&admin).Error; err != nil {
		log.Fatal("Failed to create admin user:", err)
	}

	fmt.Println("✅ Admin user created successfully!")
	fmt.Println("Email: admin@3wg.ru")
	fmt.Println("Password: admin123")
	fmt.Println("\n⚠️  Please change the password after first login!")
}
