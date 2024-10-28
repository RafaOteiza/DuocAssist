// weather.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private airQualityApiUrl = 'https://api.openweathermap.org/data/2.5/air_pollution';
  private apiKey = 'a5285a0193ab71c2fe603f37f85a3f4a'; // Tu clave de API de OpenWeather

  constructor(private http: HttpClient) {}

  // Obtener el clima de la ciudad
  getWeather(city: string): Observable<any> {
    return this.http.get(`${this.weatherApiUrl}?q=${city}&units=metric&appid=${this.apiKey}`);
  }

  // Obtener la calidad del aire basado en las coordenadas
  getAirQuality(lat: number, lon: number): Observable<any> {
    return this.http.get(`${this.airQualityApiUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}`);
  }
}
