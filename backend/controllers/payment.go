package controllers

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/3wg/vpn-backend/models"
	"github.com/3wg/vpn-backend/services"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type PaymentController struct {
	db              *gorm.DB
	providerManager *services.PaymentProviderManager
}

func NewPaymentController(db *gorm.DB) *PaymentController {
	// Создаем менеджер провайдеров
	manager := services.NewPaymentProviderManager()

	// Регистрируем ЮKassa (приоритетный провайдер)
	yooShopID := os.Getenv("YOOKASSA_SHOP_ID")
	yooSecretKey := os.Getenv("YOOKASSA_SECRET_KEY")
	if yooShopID != "" && yooSecretKey != "" {
		yooService := services.NewYooKassaService(yooShopID, yooSecretKey)
		manager.RegisterProvider(services.ProviderYooKassa, yooService)
		manager.SetDefaultProvider(services.ProviderYooKassa)
		fmt.Printf("[Payment] YooKassa provider registered as default\n")
	}

	// Регистрируем Cryptomus как fallback
	cryptoMerchantID := os.Getenv("CRYPTOMUS_MERCHANT_ID")
	cryptoAPIKey := os.Getenv("CRYPTOMUS_API_KEY")
	if cryptoMerchantID != "" && cryptoAPIKey != "" {
		cryptoService := services.NewCryptomusService(cryptoMerchantID, cryptoAPIKey)
		manager.RegisterProvider(services.ProviderCryptomus, cryptoService)
		
		// Если ЮKassa не настроена, используем Cryptomus по умолчанию
		if yooShopID == "" || yooSecretKey == "" {
			manager.SetDefaultProvider(services.ProviderCryptomus)
			fmt.Printf("[Payment] Cryptomus provider registered as default\n")
		} else {
			fmt.Printf("[Payment] Cryptomus provider registered as fallback\n")
		}
	}

	return &PaymentController{
		db:              db,
		providerManager: manager,
	}
}

func (pc *PaymentController) GetHistory(c *gin.Context) {
	userID := c.GetUint("user_id")

	var payments []models.Payment
	if err := pc.db.Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(50).
		Find(&payments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get payment history"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"payments": payments,
		"total":    len(payments),
	})
}

type CreatePaymentRequest struct {
	Amount   float64 `json:"amount" binding:"required,min=100"`
	Currency string  `json:"currency"` // RUB, USD, EUR
	Provider string  `json:"provider,omitempty"` // yookassa, cryptomus (опционально)
}

func (pc *PaymentController) Create(c *gin.Context) {
	userID := c.GetUint("user_id")

	var req CreatePaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Устанавливаем валюту по умолчанию
	if req.Currency == "" {
		req.Currency = "RUB"
	}

	// Выбираем провайдера
	var provider services.PaymentProvider
	if req.Provider != "" {
		switch req.Provider {
		case "yookassa":
			provider = pc.providerManager.GetProvider(services.ProviderYooKassa)
		case "cryptomus":
			provider = pc.providerManager.GetProvider(services.ProviderCryptomus)
		}
	}
	
	// Если провайдер не указан или не найден, используем по умолчанию
	if provider == nil {
		provider = pc.providerManager.GetDefaultProvider()
	}

	if provider == nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"error": "No payment providers configured",
		})
		return
	}

	// Генерируем уникальный order_id
	orderID := fmt.Sprintf("order_%d_%d", userID, time.Now().Unix())

	fmt.Printf("[Payment] Creating payment: user_id=%d, amount=%.2f, currency=%s, provider=%s, order_id=%s\n",
		userID, req.Amount, req.Currency, provider.GetName(), orderID)

	// Создаем платеж в БД
	payment := models.Payment{
		UserID:   userID,
		Amount:   req.Amount,
		Currency: req.Currency,
		Method:   "online", // Онлайн платеж
		Status:   "pending",
		OrderID:  orderID,
	}

	if err := pc.db.Create(&payment).Error; err != nil {
		fmt.Printf("[Payment] Failed to create payment in DB: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create payment"})
		return
	}

	fmt.Printf("[Payment] Payment created in DB: id=%d\n", payment.ID)

	// Создаем платеж через провайдера
	baseURL := os.Getenv("BASE_URL")
	if baseURL == "" {
		baseURL = "http://localhost:8080"
	}

	providerReq := services.CreatePaymentRequest{
		Amount:      req.Amount,
		Currency:    req.Currency,
		OrderID:     orderID,
		Description: fmt.Sprintf("Пополнение баланса 3WG.RU на %.2f %s", req.Amount, req.Currency),
		URLReturn:   fmt.Sprintf("%s/deposit/success", baseURL),
		URLSuccess:  fmt.Sprintf("%s/deposit/success", baseURL),
		URLCallback: fmt.Sprintf("%s/api/v1/payments/webhook", os.Getenv("API_URL")),
		Lifetime:    3600, // 1 час
	}

	providerResp, err := provider.CreatePayment(providerReq)
	if err != nil {
		fmt.Printf("[Payment] Failed to create payment with provider %s: %v\n", provider.GetName(), err)
		// Обновляем статус на failed
		pc.db.Model(&payment).Update("status", "failed")
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Sprintf("Failed to create payment: %v", err),
		})
		return
	}

	fmt.Printf("[Payment] Payment created with provider %s: id=%s, url=%s\n",
		provider.GetName(), providerResp.PaymentID, providerResp.PaymentURL)

	// Обновляем платеж данными от провайдера
	updates := map[string]interface{}{
		"payment_uuid": providerResp.PaymentID,
		"payment_url":  providerResp.PaymentURL,
		"method":       provider.GetName(),
	}

	if providerResp.ExpiredAt != nil {
		updates["expired_at"] = *providerResp.ExpiredAt
	}

	// Сохраняем данные провайдера
	if providerResp.ProviderData != nil {
		if paymentAmount, ok := providerResp.ProviderData["payment_amount"]; ok {
			updates["payment_amount"] = paymentAmount
		}
		if payerCurrency, ok := providerResp.ProviderData["payer_currency"]; ok {
			updates["payer_currency"] = payerCurrency
		}
		if network, ok := providerResp.ProviderData["network"]; ok {
			updates["network"] = network
		}
		if address, ok := providerResp.ProviderData["address"]; ok {
			updates["address"] = address
		}
	}

	if err := pc.db.Model(&payment).Updates(updates).Error; err != nil {
		fmt.Printf("[Payment] Failed to update payment with provider data: %v\n", err)
	}

	// Загружаем обновленный платеж
	pc.db.First(&payment, payment.ID)

	c.JSON(http.StatusCreated, gin.H{
		"payment":     payment,
		"payment_url": providerResp.PaymentURL,
		"provider":    provider.GetName(),
		"message":     fmt.Sprintf("Payment created successfully with %s. Redirect user to payment_url", provider.GetName()),
	})
}

// GetPaymentStatus получает статус платежа
func (pc *PaymentController) GetPaymentStatus(c *gin.Context) {
	userID := c.GetUint("user_id")
	paymentID := c.Param("id")

	var payment models.Payment
	if err := pc.db.Where("id = ? AND user_id = ?", paymentID, userID).First(&payment).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Payment not found"})
		return
	}

	// Если платеж еще pending и есть UUID, проверяем статус у провайдера
	if payment.Status == "pending" && payment.PaymentUUID != "" {
		// Определяем провайдера по методу
		var provider services.PaymentProvider
		switch payment.Method {
		case "YooKassa":
			provider = pc.providerManager.GetProvider(services.ProviderYooKassa)
		case "Cryptomus":
			provider = pc.providerManager.GetProvider(services.ProviderCryptomus)
		default:
			provider = pc.providerManager.GetDefaultProvider()
		}

		if provider != nil {
			if status, err := provider.GetPaymentStatus(payment.PaymentUUID); err == nil {
				// Обновляем статус
				oldStatus := payment.Status
				payment.Status = status.Status

				updates := map[string]interface{}{
					"status": status.Status,
				}

				// Обновляем дополнительные данные
				if status.ProviderData != nil {
					if paymentAmount, ok := status.ProviderData["payment_amount"]; ok {
						updates["payment_amount"] = paymentAmount
					}
					if network, ok := status.ProviderData["network"]; ok {
						updates["network"] = network
					}
					if address, ok := status.ProviderData["address"]; ok {
						updates["address"] = address
					}
					if txid, ok := status.ProviderData["txid"]; ok && txid != "" {
						updates["transaction_id"] = txid
					}
				}

				pc.db.Model(&payment).Updates(updates)

				// Если статус изменился на paid, начисляем баланс
				if oldStatus != "paid" && status.Status == "paid" {
					pc.creditUserBalance(payment.UserID, payment.Amount)
				}

				// Загружаем обновленный платеж
				pc.db.First(&payment, payment.ID)
			}
		}
	}

	c.JSON(http.StatusOK, payment)
}

// Webhook обработчик (универсальный для всех провайдеров)
func (pc *PaymentController) Webhook(c *gin.Context) {
	// Читаем тело запроса
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		fmt.Printf("[Webhook] Failed to read body: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read body"})
		return
	}

	// Получаем подпись
	signature := c.GetHeader("sign")
	if signature == "" {
		// Пробуем другие заголовки для разных провайдеров
		signature = c.GetHeader("X-Yookassa-Signature")
		if signature == "" {
			signature = c.GetHeader("Signature")
		}
	}

	fmt.Printf("[Webhook] Received webhook, signature: %s\n", signature)

	// Пробуем обработать webhook разными провайдерами
	var webhookData *services.WebhookData
	var usedProvider services.PaymentProvider

	// Сначала пробуем ЮKassa
	if yooProvider := pc.providerManager.GetProvider(services.ProviderYooKassa); yooProvider != nil {
		if signature != "" && yooProvider.VerifyWebhook(body, signature) {
			if data, err := yooProvider.ParseWebhook(body); err == nil {
				webhookData = data
				usedProvider = yooProvider
				fmt.Printf("[Webhook] Successfully parsed with YooKassa\n")
			}
		}
	}

	// Если не получилось с ЮKassa, пробуем Cryptomus
	if webhookData == nil {
		if cryptoProvider := pc.providerManager.GetProvider(services.ProviderCryptomus); cryptoProvider != nil {
			if signature != "" && cryptoProvider.VerifyWebhook(body, signature) {
				if data, err := cryptoProvider.ParseWebhook(body); err == nil {
					webhookData = data
					usedProvider = cryptoProvider
					fmt.Printf("[Webhook] Successfully parsed with Cryptomus\n")
				}
			}
		}
	}

	if webhookData == nil {
		fmt.Printf("[Webhook] Failed to parse webhook with any provider\n")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse webhook"})
		return
	}

	fmt.Printf("[Webhook] Processed: order_id=%s, status=%s, provider=%s\n",
		webhookData.OrderID, webhookData.Status, usedProvider.GetName())

	// Находим платеж
	var payment models.Payment
	if err := pc.db.Where("order_id = ?", webhookData.OrderID).First(&payment).Error; err != nil {
		fmt.Printf("[Webhook] Payment not found: order_id=%s\n", webhookData.OrderID)
		c.JSON(http.StatusNotFound, gin.H{"error": "Payment not found"})
		return
	}

	oldStatus := payment.Status

	// Обновляем платеж
	updates := map[string]interface{}{
		"status": webhookData.Status,
		"method": usedProvider.GetName(),
	}

	// Обновляем дополнительные данные из провайдера
	if webhookData.ProviderData != nil {
		if paymentAmount, ok := webhookData.ProviderData["payment_amount"]; ok {
			updates["payment_amount"] = paymentAmount
		}
		if payerCurrency, ok := webhookData.ProviderData["payer_currency"]; ok {
			updates["payer_currency"] = payerCurrency
		}
		if network, ok := webhookData.ProviderData["network"]; ok {
			updates["network"] = network
		}
		if address, ok := webhookData.ProviderData["address"]; ok {
			updates["address"] = address
		}
		if txid, ok := webhookData.ProviderData["txid"]; ok && txid != "" {
			updates["transaction_id"] = txid
		}
	}

	if err := pc.db.Model(&payment).Updates(updates).Error; err != nil {
		fmt.Printf("[Webhook] Failed to update payment: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update payment"})
		return
	}

	fmt.Printf("[Webhook] Payment updated: id=%d, status=%s -> %s, provider=%s\n",
		payment.ID, oldStatus, webhookData.Status, usedProvider.GetName())

	// Если платеж успешен, начисляем баланс
	if oldStatus != "paid" && webhookData.Status == "paid" {
		if err := pc.creditUserBalance(payment.UserID, payment.Amount); err != nil {
			fmt.Printf("[Webhook] Failed to credit balance: %v\n", err)
		} else {
			fmt.Printf("[Webhook] Balance credited: user_id=%d, amount=%.2f\n",
				payment.UserID, payment.Amount)
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Webhook processed"})
}

// creditUserBalance начисляет баланс пользователю
func (pc *PaymentController) creditUserBalance(userID uint, amount float64) error {
	var user models.User
	if err := pc.db.First(&user, userID).Error; err != nil {
		return fmt.Errorf("user not found: %w", err)
	}

	// Начисляем баланс
	if err := pc.db.Model(&user).
		Update("balance", gorm.Expr("balance + ?", amount)).Error; err != nil {
		return fmt.Errorf("failed to update balance: %w", err)
	}

	fmt.Printf("[Payment] Balance credited: user_id=%d, amount=%.2f, new_balance=%.2f\n",
		userID, amount, user.Balance+amount)

	return nil
}
