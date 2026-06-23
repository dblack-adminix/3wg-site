package services

import (
	"time"
)

// PaymentProvider интерфейс для всех платежных провайдеров
type PaymentProvider interface {
	// GetName возвращает название провайдера
	GetName() string
	
	// CreatePayment создает платеж
	CreatePayment(req CreatePaymentRequest) (*PaymentResponse, error)
	
	// GetPaymentStatus получает статус платежа
	GetPaymentStatus(paymentID string) (*PaymentStatusResponse, error)
	
	// VerifyWebhook проверяет подпись webhook
	VerifyWebhook(body []byte, signature string) bool
	
	// ParseWebhook парсит webhook данные
	ParseWebhook(body []byte) (*WebhookData, error)
}

// CreatePaymentRequest универсальный запрос на создание платежа
type CreatePaymentRequest struct {
	Amount      float64 `json:"amount"`
	Currency    string  `json:"currency"`
	OrderID     string  `json:"order_id"`
	Description string  `json:"description,omitempty"`
	URLReturn   string  `json:"url_return,omitempty"`
	URLSuccess  string  `json:"url_success,omitempty"`
	URLCallback string  `json:"url_callback,omitempty"`
	UserEmail   string  `json:"user_email,omitempty"`
	UserPhone   string  `json:"user_phone,omitempty"`
	Lifetime    int     `json:"lifetime,omitempty"` // В секундах
}

// PaymentResponse универсальный ответ при создании платежа
type PaymentResponse struct {
	PaymentID     string     `json:"payment_id"`
	OrderID       string     `json:"order_id"`
	Amount        string     `json:"amount"`
	Currency      string     `json:"currency"`
	Status        string     `json:"status"`
	PaymentURL    string     `json:"payment_url"`
	ExpiredAt     *time.Time `json:"expired_at,omitempty"`
	ProviderData  map[string]interface{} `json:"provider_data,omitempty"` // Специфичные данные провайдера
}

// PaymentStatusResponse статус платежа
type PaymentStatusResponse struct {
	PaymentID    string                 `json:"payment_id"`
	OrderID      string                 `json:"order_id"`
	Status       string                 `json:"status"`
	Amount       string                 `json:"amount"`
	Currency     string                 `json:"currency"`
	PaidAt       *time.Time             `json:"paid_at,omitempty"`
	ProviderData map[string]interface{} `json:"provider_data,omitempty"`
}

// WebhookData данные из webhook
type WebhookData struct {
	PaymentID    string                 `json:"payment_id"`
	OrderID      string                 `json:"order_id"`
	Status       string                 `json:"status"`
	Amount       string                 `json:"amount"`
	Currency     string                 `json:"currency"`
	PaidAt       *time.Time             `json:"paid_at,omitempty"`
	IsFinal      bool                   `json:"is_final"`
	ProviderData map[string]interface{} `json:"provider_data,omitempty"`
}

// PaymentProviderType тип платежного провайдера
type PaymentProviderType string

const (
	ProviderCryptomus PaymentProviderType = "cryptomus"
	ProviderYooKassa  PaymentProviderType = "yookassa"
)

// PaymentProviderManager менеджер платежных провайдеров
type PaymentProviderManager struct {
	providers       map[PaymentProviderType]PaymentProvider
	defaultProvider PaymentProviderType
}

// NewPaymentProviderManager создает новый менеджер
func NewPaymentProviderManager() *PaymentProviderManager {
	return &PaymentProviderManager{
		providers:       make(map[PaymentProviderType]PaymentProvider),
		defaultProvider: ProviderYooKassa, // По умолчанию ЮKassa
	}
}

// RegisterProvider регистрирует провайдера
func (m *PaymentProviderManager) RegisterProvider(providerType PaymentProviderType, provider PaymentProvider) {
	m.providers[providerType] = provider
}

// GetProvider получает провайдера по типу
func (m *PaymentProviderManager) GetProvider(providerType PaymentProviderType) PaymentProvider {
	if provider, exists := m.providers[providerType]; exists {
		return provider
	}
	return nil
}

// GetDefaultProvider получает провайдера по умолчанию
func (m *PaymentProviderManager) GetDefaultProvider() PaymentProvider {
	return m.GetProvider(m.defaultProvider)
}

// SetDefaultProvider устанавливает провайдера по умолчанию
func (m *PaymentProviderManager) SetDefaultProvider(providerType PaymentProviderType) {
	m.defaultProvider = providerType
}

// GetAvailableProviders возвращает список доступных провайдеров
func (m *PaymentProviderManager) GetAvailableProviders() []PaymentProviderType {
	var providers []PaymentProviderType
	for providerType := range m.providers {
		providers = append(providers, providerType)
	}
	return providers
}