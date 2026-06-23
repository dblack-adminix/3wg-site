package services

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

// IPGeolocation представляет данные геолокации
type IPGeolocation struct {
	Status      string  `json:"status"`
	Country     string  `json:"country"`
	CountryCode string  `json:"countryCode"`
	Region      string  `json:"region"`
	RegionName  string  `json:"regionName"`
	City        string  `json:"city"`
	Lat         float64 `json:"lat"`
	Lon         float64 `json:"lon"`
	ISP         string  `json:"isp"`
	Query       string  `json:"query"`
}

// IPGeolocationService сервис для работы с геолокацией
type IPGeolocationService struct {
	httpClient *http.Client
}

// NewIPGeolocationService создает новый сервис геолокации
func NewIPGeolocationService() *IPGeolocationService {
	return &IPGeolocationService{
		httpClient: &http.Client{
			Timeout: 5 * time.Second,
		},
	}
}

// GetGeolocation получает геолокацию по IP адресу
func (s *IPGeolocationService) GetGeolocation(ip string) (*IPGeolocation, error) {
	// Пропускаем локальные и приватные IP
	if ip == "" || ip == "0.0.0.0" || ip == "127.0.0.1" || ip == "localhost" {
		return nil, fmt.Errorf("invalid IP address: %s", ip)
	}

	// API endpoint с нужными полями
	url := fmt.Sprintf("http://ip-api.com/json/%s?fields=status,country,countryCode,region,regionName,city,lat,lon,isp,query", ip)
	
	log.Printf("[IPGeolocation] Requesting geolocation for IP: %s", ip)
	
	resp, err := s.httpClient.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to request geolocation: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("geolocation API returned status: %d", resp.StatusCode)
	}

	var geo IPGeolocation
	if err := json.NewDecoder(resp.Body).Decode(&geo); err != nil {
		return nil, fmt.Errorf("failed to decode geolocation response: %w", err)
	}

	if geo.Status != "success" {
		return nil, fmt.Errorf("geolocation API returned status: %s", geo.Status)
	}

	log.Printf("[IPGeolocation] Success: %s, %s (%f, %f)", geo.City, geo.Country, geo.Lat, geo.Lon)
	
	return &geo, nil
}
