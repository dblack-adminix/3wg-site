package services

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

// GeoLocation представляет данные о геолокации IP адреса
type GeoLocation struct {
	Country     string  `json:"country"`
	CountryCode string  `json:"countryCode"`
	Region      string  `json:"region"`
	RegionName  string  `json:"regionName"`
	City        string  `json:"city"`
	Zip         string  `json:"zip"`
	Lat         float64 `json:"lat"`
	Lon         float64 `json:"lon"`
	Timezone    string  `json:"timezone"`
	ISP         string  `json:"isp"`
	Org         string  `json:"org"`
	AS          string  `json:"as"`
	Query       string  `json:"query"`
	Status      string  `json:"status"`
	Message     string  `json:"message"`
}

// GetIPGeolocation получает геолокацию по IP адресу через ip-api.com
func GetIPGeolocation(ipAddress string) (*GeoLocation, error) {
	// API endpoint (бесплатный, без ключа, лимит 45 запросов в минуту)
	url := fmt.Sprintf("http://ip-api.com/json/%s?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query", ipAddress)
	
	// Создаем HTTP клиент с таймаутом
	client := &http.Client{
		Timeout: 10 * time.Second,
	}
	
	// Делаем запрос
	resp, err := client.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch geolocation: %w", err)
	}
	defer resp.Body.Close()
	
	// Читаем ответ
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}
	
	// Парсим JSON
	var geo GeoLocation
	if err := json.Unmarshal(body, &geo); err != nil {
		return nil, fmt.Errorf("failed to parse JSON: %w", err)
	}
	
	// Проверяем статус
	if geo.Status != "success" {
		return nil, fmt.Errorf("geolocation API error: %s", geo.Message)
	}
	
	return &geo, nil
}

// GetLocationString возвращает строку локации в формате "City, Region"
func (g *GeoLocation) GetLocationString() string {
	if g.City != "" && g.RegionName != "" {
		return fmt.Sprintf("%s, %s", g.City, g.RegionName)
	}
	if g.City != "" {
		return g.City
	}
	if g.RegionName != "" {
		return g.RegionName
	}
	return g.Country
}
