package main

import (
	"log"
	"os"
	"time"

	"github.com/3wg/vpn-backend/config"
	"github.com/3wg/vpn-backend/database"
	"github.com/3wg/vpn-backend/routes"
	"github.com/3wg/vpn-backend/services"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Initialize configuration
	cfg := config.Load()

	// Initialize database
	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Run migrations
	if err := database.Migrate(db); err != nil {
		log.Fatal("Failed to run migrations:", err)
	}

	// Set Gin mode
	if cfg.Env == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Initialize router
	router := gin.Default()

	// Setup CORS
	router.Use(corsMiddleware())

	// Setup routes
	routes.Setup(router, db, cfg)

	// Start background sync workers
	log.Println("🔄 Starting sync workers...")
	syncWorker := services.NewSyncWorker(
		db,
		2*time.Second,  // Метрики каждые 2 секунды
		30*time.Second, // Данные каждые 30 секунд
	)
	syncWorker.Start()
	log.Println("✅ Sync workers started (metrics: 2s, data: 30s)")

	// Start traffic history worker (daily + hourly snapshots with backfill)
	log.Println("📊 Starting traffic history worker...")
	trafficWorker := services.NewTrafficHistoryWorker(db)
	trafficWorker.Start()
	log.Println("✅ Traffic history worker started (daily + hourly snapshots with backfill)")

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	log.Printf("🚀 Server starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:8080")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
