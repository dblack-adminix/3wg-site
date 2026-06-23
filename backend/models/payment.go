package models

import (
	"time"

	"gorm.io/gorm"
)

type Payment struct {
	ID            uint           `gorm:"primarykey" json:"id"`
	UserID        uint           `gorm:"not null" json:"user_id"`
	User          User           `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Amount        float64        `gorm:"not null" json:"amount"`
	Currency      string         `gorm:"default:RUB" json:"currency"`
	Method        string         `gorm:"not null" json:"method"` // crypto, card
	Status        string         `gorm:"default:pending" json:"status"` // pending, paid, failed, cancelled, expired
	TransactionID string         `gorm:"uniqueIndex" json:"transaction_id,omitempty"`
	OrderID       string         `gorm:"uniqueIndex;not null" json:"order_id"` // Уникальный ID заказа
	PaymentUUID   string         `gorm:"index" json:"payment_uuid,omitempty"` // UUID от Cryptomus
	PaymentURL    string         `json:"payment_url,omitempty"` // URL для оплаты
	PaymentAmount string         `json:"payment_amount,omitempty"` // Сумма в крипте
	PayerCurrency string         `json:"payer_currency,omitempty"` // Валюта оплаты (BTC, USDT, etc)
	Network       string         `json:"network,omitempty"` // Сеть (TRC20, ERC20, etc)
	Address       string         `json:"address,omitempty"` // Адрес для оплаты
	ExpiredAt     *time.Time     `json:"expired_at,omitempty"` // Время истечения
	Plan          string         `json:"plan,omitempty"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
}
