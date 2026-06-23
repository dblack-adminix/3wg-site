package services

import (
	"bytes"
	"crypto/md5"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"sort"
	"strings"
	"time"
)

// CryptomusService работает с Cryptomus API
type CryptomusService struct {
	merchantID string
	apiKey     string
	baseURL    string
	httpClient *http.Client
}

// NewCryptomusService создает новый сервис Cryptomus
func NewCryptomusService(merchantID, apiKey string) *CryptomusService {
	return &CryptomusService{
		merchantID: merchantID,
		apiKey:     apiKey,
		baseURL:    "https://api.cryptomus.com/v1",
		httpClient: &http.Client{Timeout: 30 * time.Second},
	}
}

// GetName возвращает название провайдера
func (s *CryptomusService) GetName() string {
	return "Cryptomus"
}

// CreateInvoiceRequest запрос на создание инвойса
type CreateInvoiceRequest struct {
	Amount      string `json:"amount"`
	Currency    string `json:"currency"`
	OrderID     string `json:"order_id"`
	URLReturn   string `json:"url_return,omitempty"`
	URLSuccess  string `json:"url_success,omitempty"`
	URLCallback string `json:"url_callback,omitempty"`
	Lifetime    int    `json:"lifetime,omitempty"` // В секундах, по умолчанию 3600
}

// InvoiceResponse ответ с инвойсом
type InvoiceResponse struct {
	State  int `json:"state"`
	Result struct {
		UUID           string  `json:"uuid"`
		OrderID        string  `json:"order_id"`
		Amount         string  `json:"amount"`
		PaymentAmount  *string `json:"payment_amount"`
		PayerAmount    *string `json:"payer_amount"`
		PayerCurrency  *string `json:"payer_currency"`
		Currency       string  `json:"currency"`
		MerchantAmount *string `json:"merchant_amount"`
		Network        *string `json:"network"`
		Address        *string `json:"address"`
		From           *string `json:"from"`
		TxID           *string `json:"txid"`
		PaymentStatus  string  `json:"payment_status"`
		URL            string  `json:"url"`
		ExpiredAt      int64   `json:"expired_at"`
		Status         string  `json:"status"`
		IsFinal        bool    `json:"is_final"`
		CreatedAt      string  `json:"created_at"`
		UpdatedAt      string  `json:"updated_at"`
	} `json:"result"`
}

// PaymentInfo информация о платеже
type PaymentInfo struct {
	UUID          string  `json:"uuid"`
	OrderID       string  `json:"order_id"`
	Amount        string  `json:"amount"`
	PaymentAmount string  `json:"payment_amount"`
	PaymentStatus string  `json:"payment_status"`
	Currency      string  `json:"currency"`
	Network       string  `json:"network"`
	Address       string  `json:"address"`
	TxID          string  `json:"txid"`
	IsFinal       bool    `json:"is_final"`
	CreatedAt     string  `json:"created_at"`
	UpdatedAt     string  `json:"updated_at"`
}

// CreatePayment создает платеж (реализация интерфейса PaymentProvider)
func (s *CryptomusService) CreatePayment(req CreatePaymentRequest) (*PaymentResponse, error) {
	// Конвертируем в формат Cryptomus
	cryptoReq := CreateInvoiceRequest{
		Amount:      fmt.Sprintf("%.2f", req.Amount),
		Currency:    req.Currency,
		OrderID:     req.OrderID,
		URLReturn:   req.URLReturn,
		URLSuccess:  req.URLSuccess,
		URLCallback: req.URLCallback,
		Lifetime:    req.Lifetime,
	}

	invoice, err := s.CreateInvoice(cryptoReq)
	if err != nil {
		return nil, err
	}

	// Конвертируем в универсальный формат
	expiredAt := time.Unix(invoice.Result.ExpiredAt, 0)
	result := &PaymentResponse{
		PaymentID:  invoice.Result.UUID,
		OrderID:    invoice.Result.OrderID,
		Amount:     invoice.Result.Amount,
		Currency:   invoice.Result.Currency,
		Status:     s.convertStatus(invoice.Result.PaymentStatus),
		PaymentURL: invoice.Result.URL,
		ExpiredAt:  &expiredAt,
		ProviderData: map[string]interface{}{
			"cryptomus_uuid":   invoice.Result.UUID,
			"cryptomus_status": invoice.Result.PaymentStatus,
			"payment_amount":   invoice.Result.PaymentAmount,
			"payer_currency":   invoice.Result.PayerCurrency,
			"network":          invoice.Result.Network,
			"address":          invoice.Result.Address,
		},
	}

	return result, nil
}

// GetPaymentStatus получает статус платежа (реализация интерфейса PaymentProvider)
func (s *CryptomusService) GetPaymentStatus(paymentID string) (*PaymentStatusResponse, error) {
	info, err := s.GetPaymentInfo(paymentID)
	if err != nil {
		return nil, err
	}

	result := &PaymentStatusResponse{
		PaymentID: info.UUID,
		OrderID:   info.OrderID,
		Status:    s.convertStatus(info.PaymentStatus),
		Amount:    info.Amount,
		Currency:  info.Currency,
		ProviderData: map[string]interface{}{
			"cryptomus_uuid":   info.UUID,
			"cryptomus_status": info.PaymentStatus,
			"payment_amount":   info.PaymentAmount,
			"network":          info.Network,
			"address":          info.Address,
			"txid":             info.TxID,
		},
	}

	// Если платеж успешен, парсим время
	if info.PaymentStatus == "paid" && info.UpdatedAt != "" {
		if paidAt, err := time.Parse(time.RFC3339, info.UpdatedAt); err == nil {
			result.PaidAt = &paidAt
		}
	}

	return result, nil
}

// ParseWebhook парсит webhook от Cryptomus (реализация интерфейса PaymentProvider)
func (s *CryptomusService) ParseWebhook(body []byte) (*WebhookData, error) {
	var webhook struct {
		UUID          string `json:"uuid"`
		OrderID       string `json:"order_id"`
		Amount        string `json:"amount"`
		PaymentAmount string `json:"payment_amount"`
		PaymentStatus string `json:"payment_status"`
		Currency      string `json:"currency"`
		PayerCurrency string `json:"payer_currency"`
		Network       string `json:"network"`
		Address       string `json:"address"`
		TxID          string `json:"txid"`
		IsFinal       bool   `json:"is_final"`
		UpdatedAt     string `json:"updated_at"`
	}

	if err := json.Unmarshal(body, &webhook); err != nil {
		return nil, fmt.Errorf("failed to parse webhook: %w", err)
	}

	result := &WebhookData{
		PaymentID: webhook.UUID,
		OrderID:   webhook.OrderID,
		Status:    s.convertStatus(webhook.PaymentStatus),
		Amount:    webhook.Amount,
		Currency:  webhook.Currency,
		IsFinal:   webhook.IsFinal,
		ProviderData: map[string]interface{}{
			"cryptomus_uuid":   webhook.UUID,
			"cryptomus_status": webhook.PaymentStatus,
			"payment_amount":   webhook.PaymentAmount,
			"payer_currency":   webhook.PayerCurrency,
			"network":          webhook.Network,
			"address":          webhook.Address,
			"txid":             webhook.TxID,
		},
	}

	// Парсим время оплаты
	if webhook.PaymentStatus == "paid" && webhook.UpdatedAt != "" {
		if paidAt, err := time.Parse(time.RFC3339, webhook.UpdatedAt); err == nil {
			result.PaidAt = &paidAt
		}
	}

	return result, nil
}

// convertStatus конвертирует статус Cryptomus в универсальный
func (s *CryptomusService) convertStatus(cryptoStatus string) string {
	switch cryptoStatus {
	case "pending", "process", "check":
		return "pending"
	case "paid", "success":
		return "paid"
	case "cancel", "cancelled":
		return "cancelled"
	case "fail", "failed":
		return "failed"
	case "expired":
		return "expired"
	default:
		return "pending"
	}
}

// CreateInvoice создает инвойс для оплаты
func (s *CryptomusService) CreateInvoice(req CreateInvoiceRequest) (*InvoiceResponse, error) {
	// Устанавливаем значения по умолчанию
	if req.Lifetime == 0 {
		req.Lifetime = 3600 // 1 час
	}

	// Создаем запрос
	body, err := json.Marshal(req)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	// Отправляем запрос
	resp, err := s.doRequest("POST", "/payment", body)
	if err != nil {
		return nil, err
	}

	// Парсим ответ
	var invoiceResp InvoiceResponse
	if err := json.Unmarshal(resp, &invoiceResp); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	if invoiceResp.State != 0 {
		return nil, fmt.Errorf("API returned error state: %d", invoiceResp.State)
	}

	return &invoiceResp, nil
}

// GetPaymentInfo получает информацию о платеже
func (s *CryptomusService) GetPaymentInfo(uuid string) (*PaymentInfo, error) {
	req := map[string]string{
		"uuid": uuid,
	}

	body, err := json.Marshal(req)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	resp, err := s.doRequest("POST", "/payment/info", body)
	if err != nil {
		return nil, err
	}

	var result struct {
		State  int         `json:"state"`
		Result PaymentInfo `json:"result"`
	}

	if err := json.Unmarshal(resp, &result); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	if result.State != 0 {
		return nil, fmt.Errorf("API returned error state: %d", result.State)
	}

	return &result.Result, nil
}

// VerifyWebhook проверяет подпись webhook
func (s *CryptomusService) VerifyWebhook(body []byte, signature string) bool {
	// Вычисляем подпись
	calculatedSignature := s.generateSignature(body)
	return calculatedSignature == signature
}

// doRequest выполняет HTTP запрос к API
func (s *CryptomusService) doRequest(method, endpoint string, body []byte) ([]byte, error) {
	url := s.baseURL + endpoint

	req, err := http.NewRequest(method, url, bytes.NewBuffer(body))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Генерируем подпись
	signature := s.generateSignature(body)

	// Устанавливаем заголовки
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("merchant", s.merchantID)
	req.Header.Set("sign", signature)

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
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API returned status %d: %s", resp.StatusCode, string(respBody))
	}

	return respBody, nil
}

// generateSignature генерирует подпись для запроса
func (s *CryptomusService) generateSignature(body []byte) string {
	// Парсим JSON
	var data map[string]interface{}
	if err := json.Unmarshal(body, &data); err != nil {
		return ""
	}

	// Сортируем ключи
	keys := make([]string, 0, len(data))
	for k := range data {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	// Создаем строку для подписи
	var parts []string
	for _, k := range keys {
		v := data[k]
		// Конвертируем значение в строку
		var strValue string
		switch val := v.(type) {
		case string:
			strValue = val
		case float64:
			strValue = fmt.Sprintf("%.0f", val)
		case bool:
			if val {
				strValue = "1"
			} else {
				strValue = "0"
			}
		default:
			strValue = fmt.Sprintf("%v", val)
		}
		parts = append(parts, strValue)
	}

	// Объединяем значения
	dataString := strings.Join(parts, "")

	// Добавляем API ключ
	dataString = base64.StdEncoding.EncodeToString([]byte(dataString)) + s.apiKey

	// Вычисляем MD5
	hash := md5.Sum([]byte(dataString))
	return fmt.Sprintf("%x", hash)
}
