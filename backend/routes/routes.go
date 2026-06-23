package routes

import (
	"github.com/3wg/vpn-backend/config"
	"github.com/3wg/vpn-backend/controllers"
	"github.com/3wg/vpn-backend/middleware"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Setup(router *gin.Engine, db *gorm.DB, cfg *config.Config) {
	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// API v1
	v1 := router.Group("/api/v1")
	{
		// Auth routes
		auth := v1.Group("/auth")
		{
			authController := controllers.NewAuthController(db, cfg)
			auth.POST("/register", authController.Register)
			auth.POST("/login", authController.Login)
			auth.POST("/refresh", authController.RefreshToken)
		}

		// Protected routes
		protected := v1.Group("")
		protected.Use(middleware.AuthMiddleware(cfg.JWTSecret))
		{
			// User routes
			users := protected.Group("/users")
			{
				userController := controllers.NewUserController(db)
				users.GET("/me", userController.GetMe)
				users.PUT("/me", userController.UpdateMe)
				users.GET("/me/stats", userController.GetMyStats)
			users.GET("/me/traffic", userController.GetMyTraffic)
			}

			// Server routes
			servers := protected.Group("/servers")
			{
				serverController := controllers.NewServerController(db)
				servers.GET("", serverController.GetAll)
				servers.GET("/:id", serverController.GetByID)
			}

			// VPN Key routes
			keys := protected.Group("/keys")
			{
				keyController := controllers.NewVPNKeyController(db)
				keys.GET("", keyController.GetMyKeys)
				keys.POST("", keyController.Create)
				keys.GET("/:id", keyController.GetByID)
				keys.GET("/:id/config", keyController.GetConfig)
				keys.GET("/:id/amnezia-json", keyController.GetAmneziaJSON)
				keys.DELETE("/:id", keyController.Delete)
			}

			// Limits routes
			limits := protected.Group("/limits")
			{
				limitsController := controllers.NewLimitsController(db)
				limits.POST("/check", limitsController.CheckLimits)
				limits.GET("/stats", limitsController.GetUserStats)
			}

			// Payment routes
			payments := protected.Group("/payments")
			{
				paymentController := controllers.NewPaymentController(db)
				payments.GET("/history", paymentController.GetHistory)
				payments.POST("/create", paymentController.Create)
				payments.GET("/:id/status", paymentController.GetPaymentStatus)
			}

			// Speed Test routes
			speedTest := protected.Group("/speed-test")
			{
				speedTestController := controllers.NewSpeedTestController(db)
				speedTest.POST("/start", speedTestController.StartTest)
				speedTest.GET("/download", speedTestController.DownloadTest)
				speedTest.POST("/upload", speedTestController.UploadTest)
				speedTest.GET("/ping", speedTestController.PingTest)
				speedTest.POST("/result", speedTestController.SaveResult)
				speedTest.GET("/history", speedTestController.GetHistory)
				speedTest.GET("/comparison", speedTestController.GetComparison)
			}
		}

		// Public payment webhook (не требует авторизации)
		v1.POST("/payments/webhook", func(c *gin.Context) {
			paymentController := controllers.NewPaymentController(db)
			paymentController.Webhook(c)
		})

		// Admin routes
		admin := v1.Group("/admin")
		admin.Use(middleware.AuthMiddleware(cfg.JWTSecret))
		admin.Use(middleware.AdminMiddleware())
		{
			adminController := controllers.NewAdminController(db)
			admin.GET("/dashboard", adminController.GetDashboard)
			admin.GET("/users", adminController.GetUsers)
			admin.GET("/analytics", adminController.GetAnalytics)
			admin.GET("/keys", adminController.GetAllKeys)
			
			// Server management
			admin.GET("/servers/:id", adminController.GetServer)
			admin.POST("/servers", adminController.CreateServer)
			admin.PUT("/servers/:id", adminController.UpdateServer)
			admin.DELETE("/servers/:id", adminController.DeleteServer)
			admin.POST("/servers/:id/update-geolocation", adminController.UpdateServerGeolocation)

			// WGDashboard integration
			wgController := controllers.NewWGDashboardController(db)
			admin.GET("/servers/:id/wg/test", wgController.TestConnection)
			admin.GET("/servers/:id/wg/config", wgController.GetServerConfig)
			admin.GET("/servers/:id/wg/peers", wgController.GetServerPeers)
			admin.GET("/servers/:id/wg/status", wgController.GetSystemStatus)
			admin.POST("/servers/:id/wg/peers", wgController.AddPeerToServer)
			admin.DELETE("/servers/:id/wg/peers", wgController.RemovePeerFromServer) // Изменено: убрали :peer_id из пути
			admin.GET("/servers/:id/wg/peers/geolocation", wgController.GetPeerGeolocation) // Изменено: убрали :peer_id
			admin.GET("/servers/:id/wg/peers/traffic-history", wgController.GetPeerTrafficHistory) // Изменено: убрали :peer_id
			admin.GET("/servers/:id/wg/peers/traffic-hourly", wgController.GetPeerTrafficHourly) // Почасовая история
			admin.GET("/servers/:id/wg/peers/config", wgController.GetPeerConfig) // Конфиг пира
			admin.GET("/servers/:id/wg/traffic/interfaces", wgController.GetInterfaceTraffic) // Трафик интерфейсов (3wg-panel)
			admin.POST("/servers/:id/wg/peers/toggle", wgController.TogglePeer) // Вкл/выкл пира (3wg-panel)
			admin.GET("/servers/:id/wg/peers/vpn-config", wgController.GetPeerVPNConfig) // AmneziaVPN конфиг (3wg-panel)
			admin.PATCH("/servers/:id/wg/peers/update", wgController.UpdatePeerInfo) // Имя/категория пира (3wg-panel)
			admin.GET("/servers/:id/wg/categories", wgController.GetServerCategories) // Категории пиров (3wg-panel)
			
			// WGDashboard cached endpoints (fast!)
			admin.GET("/servers/:id/wg/config/cached", wgController.GetCachedConfig)
			admin.GET("/servers/:id/wg/peers/cached", wgController.GetCachedPeers)
			admin.GET("/servers/:id/wg/status/cached", wgController.GetCachedSystemStatus)

			// Settings management
			settingsController := controllers.NewSettingsController(db)
			admin.GET("/settings", settingsController.GetAllSettings)
			admin.GET("/settings/homepage", settingsController.GetHomePageSettings)
			admin.PUT("/settings/homepage", settingsController.UpdateHomePageSettings)
			admin.GET("/settings/system", settingsController.GetSystemSettings)
			admin.PUT("/settings/system", settingsController.UpdateSystemSettings)
			admin.GET("/settings/blocks/:block_key", settingsController.GetBlockContent)
			admin.PUT("/settings/blocks/:block_key", settingsController.UpdateBlockContent)
			admin.GET("/settings/pages/hardware", settingsController.GetHardwarePageSettings)
			admin.PUT("/settings/pages/hardware", settingsController.UpdateHardwarePageSettings)
			admin.GET("/settings/pages/pricing", settingsController.GetPricingPageSettings)
			admin.PUT("/settings/pages/pricing", settingsController.UpdatePricingPageSettings)
		}

		// Public settings (для фронтенда)
		settings := v1.Group("/settings")
		{
			settingsController := controllers.NewSettingsController(db)
			settings.GET("/homepage", settingsController.GetHomePageSettings)
			settings.GET("/system", settingsController.GetSystemSettings)
			settings.GET("/blocks/:block_key", settingsController.GetBlockContent)
			settings.GET("/pages/hardware", settingsController.GetHardwarePageSettings)
			settings.GET("/pages/pricing", settingsController.GetPricingPageSettings)
		}
	}
}
