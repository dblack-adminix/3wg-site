package services

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

// YooKassaService сервис для работы с ЮKassa API
type YooKassaService struct {
	shopID     string
	secretKey  string
	baseURL    string
	httpClient *http.Client
}

// NewYooKassaService создает новый сервис ЮKassa
func NewYooKassaService(shopID, secretKey string) *YooKassaService {
	return &YooKassaService{
		shopID:     shopID,
		secretKey:  secretKey,
		baseURL:    "https://api.yookassa.ru/v3",
		httpClient: &http.Client{Timeout: 30 * time.Second},
	}
}

// GetName возвращает название провайдера
func (s *YooKassaService) GetName() string {
	return "YooKassa"
}

// YooKassaPaymentRequest запрос на создание платежа в ЮKassa
type YooKassaPaymentRequest struct {
	Amount      YooKassaAmount      `json:"amount"`
	Currency    string              `json:"currency"`
	Description string              `json:"description,omitempty"`
	Metadata    map[string]string   `json:"metadata,omitempty"`
	Confirmation YooKassaConfirmation `json:"confirmation"`
	Capture     bool                `json:"capture"`
}

type YooKassaAmount struct {
	Value    string `json:"value"`
	Currency string `json:"currency"`
}

type YooKassaConfirmation struct {
	Type      string `json:"type"`
	ReturnURL string `json:"return_url,omitempty"`
}

// YooKassaPaymentResponse ответ от ЮKassa при создании платежа
type YooKassaPaymentResponse struct {
	ID           string                 `json:"id"`
	Status       string                 `json:"status"`
	Amount       YooKassaAmount         `json:"amount"`
	Description  string                 `json:"description"`
	Metadata     map[string]string      `json:"metadata"`
	Confirmation YooKassaConfirmation   `json:"confirmation"`
	CreatedAt    time.Time              `json:"created_at"`
	ExpiresAt    *time.Time             `json:"expires_at,omitempty"`
	Test         bool                   `json:"test"`
}

// CreatePayment создает платеж в ЮKassa
func (s *YooKassaService) CreatePayment(req CreatePaymentRequest) (*PaymentResponse, error) {
	// Подготавливаем запрос для ЮKassa
	yooReq := YooKassaPaymentRequest{
		Amount: YooKassaAmount{
			Value:    fmt.Sprintf("%.2f", req.Amount),
			Currency: strings.ToUpper(req.Currency),
		},
		Currency:    strings.ToUpper(req.Currency),
		Description: req.Description,
		Metadata: map[string]string{
			"order_id": req.OrderID,
		},
		Confirmation: YooKassaConfirmation{
			Type:      "redirect",
			ReturnURL: req.URLReturn,
		},
		Capture: true, // Автоматическое списание
	}

	// Добавляем email если есть
	if req.UserEmail != "" {
		yooReq.Metadata["user_email"] = req.UserEmail
	}

	body, err := json.Marshal(yooReq)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	// Отправляем запрос
	resp, err := s.doRequest("POST", "/payments", body, req.OrderID)
	if err != nil {
		return nil, err
	}

	// Парсим ответ
	var yooResp YooKassaPaymentResponse
	if err := json.Unmarshal(resp, &yooResp); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	// Конвертируем в универсальный формат
	result := &PaymentResponse{
		PaymentID:  yooResp.ID,
		OrderID:    req.OrderID,
		Amount:     yooResp.Amount.Value,
		Currency:   yooResp.Amount.Currency,
		Status:     s.convertStatus(yooResp.Status),
		PaymentURL: yooResp.Confirmation.ReturnURL,
		ExpiredAt:  yooResp.ExpiresAt,
		ProviderData: map[string]interface{}{
			"yookassa_id":     yooResp.ID,
			"yookassa_status": yooResp.Status,
			"test":            yooResp.Test,
		},
	}

	// Получаем URL для оплаты из confirmation
	if confirmationURL := yooResp.Confirmation.ReturnURL; confirmationURL != "" {
		result.PaymentURL = confirmationURL
	}

	return result, nil
}

// GetPaymentStatus получает статус платежа
func (s *YooKassaService) GetPaymentStatus(paymentID string) (*PaymentStatusResponse, error) {
	resp, err := s.doRequest("GET", "/payments/"+paymentID, nil, "")
	if err != nil {
		return nil, err
	}

	var yooResp YooKassaPaymentResponse
	if err := json.Unmarshal(resp, &yooResp); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	result := &PaymentStatusResponse{
		PaymentID: yooResp.ID,
		OrderID:   yooResp.Metadata["order_id"],
		Status:    s.convertStatus(yooResp.Status),
		Amount:    yooResp.Amount.Value,
		Currency:  yooResp.Amount.Currency,
		ProviderData: map[string]interface{}{
			"yookassa_id":     yooResp.ID,
			"yookassa_status": yooResp.Status,
			"test":            yooResp.Test,
		},
	}

	// Если платеж успешен, устанавливаем время оплаты
	if yooResp.Status == "succeeded" {
		result.PaidAt = &yooResp.CreatedAt
	}

	return result, nil
}

// VerifyWebhook проверяет подпись webhook от ЮKassa
func (s *YooKassaService) VerifyWebhook(body []byte, signature string) bool {
	// ЮKassa использует HMAC-SHA256
	mac := hmac.New(sha256.New, []byte(s.secretKey))
	mac.Write(body)
	expectedSignature := hex.EncodeToString(mac.Sum(nil))
	
	return hmac.Equal([]byte(signature), []byte(expectedSignature))
}

// ParseWebhook парсит webhook от ЮKassa
func (s *YooKassaService) ParseWebhook(body []byte) (*WebhookData, error) {
	var webhook struct {
		Type   string                 `json:"type"`
		Event  string                 `json:"event"`
		Object YooKassaPaymentResponse `json:"object"`
	}

	if err := json.Unmarshal(body, &webhook); err != nil {
		return nil, fmt.Errorf("failed to parse webhook: %w", err)
	}

	result := &WebhookData{
		PaymentID: webhook.Object.ID,
		OrderID:   webhook.Object.Metadata["order_id"],
		Status:    s.convertStatus(webhook.Object.Status),
		Amount:    webhook.Object.Amount.Value,
		Currency:  webhook.Object.Amount.Currency,
		IsFinal:   webhook.Object.Status == "succeeded" || webhook.Object.Status == "canceled",
		ProviderData: map[string]interface{}{
			"yookassa_id":     webhook.Object.ID,
			"yookassa_status": webhook.Object.Status,
			"event":           webhook.Event,
			"type":            webhook.Type,
		},
	}

	if webhook.Object.Status == "succeeded" {
		result.PaidAt = &webhook.Object.CreatedAt
	}

	return result, nil
}

// convertStatus конвертирует статус ЮKassa в универсальный
func (s *YooKassaService) convertStatus(yooStatus string) string {
	switch yooStatus {
	case "pending":
		return "pending"
	case "waiting_for_capture":
		return "pending"
	case "succeeded":
		return "paid"
	case "canceled":
		return "cancelled"
	default:
		return "failed"
	}
}

// doRequest выполняет HTTP запрос к ЮKassa API
func (s *YooKassaService) doRequest(method, endpoint string, body []byte, idempotencyKey string) ([]byte, error) {
	url := s.baseURL + endpoint

	req, err := http.NewRequest(method, url, bytes.NewBuffer(body))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Устанавливаем заголовки
	req.Header.Set("Content-Type", "application/json")
	req.SetBasicAuth(s.shopID, s.secretKey)

	// Idempotency-Key для POST запросов
	if method == "POST" && idempotencyKey != "" {
		req.Header.Set("Idempotency-Key", idempotencyKey)
	}

	// Выполняем запрос
	resp, err := s.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to execute request: %w", err)
	}
	defer resp.Body.Close()

	// Читаем ответ
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	// Проверяем статус
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("API returned status %d: %s", resp.StatusCode, string(respBody))
	}

	return respBody, nil
}