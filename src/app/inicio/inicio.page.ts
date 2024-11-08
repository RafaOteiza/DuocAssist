// src/app/inicio/inicio.page.ts
import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { PhotosService } from '../photos.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { WeatherService } from '../services/weather.service';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AsignaturaService } from '../services/asignatura.service';
import { Asignatura } from '../models/asignatura.model';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  nombreUsuario: string = '';
  apellidoUsuario: string = '';
  fechaHoy!: string;
  nombreDia!: string;
  photos: string[] = [];
  temperature: number | null = null;
  airQuality: string = '';
  clasesHoy: Asignatura[] = [];

  constructor(
    public navCtrl: NavController,
    private photoService: PhotosService,
    private afAuth: AngularFireAuth,
    private weatherService: WeatherService,
    private alertController: AlertController,
    private asignaturaService: AsignaturaService
  ) {
    this.photos = this.photoService.photos;
  }

  ngOnInit() {
    this.updateDate();
    this.loadPersonalData();
    this.getWeatherAndAirQuality('Santiago');
    this.loadTodayClasses(); // Carga las clases de hoy
  }

  updateDate() {
    const hoy = new Date();
    this.fechaHoy = hoy.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    this.nombreDia = hoy.toLocaleDateString('es-ES', { weekday: 'long' });
  }

  loadPersonalData() {
    const datosPersonales = JSON.parse(localStorage.getItem('datosPersonales') || '{}');
    if (datosPersonales && datosPersonales.nombre) {
      this.nombreUsuario = datosPersonales.nombre;
      this.apellidoUsuario = datosPersonales.apellido || '';
    } else {
      this.afAuth.authState.subscribe(user => {
        if (user && user.email) {
          this.nombreUsuario = user.email.split('@')[0];
        }
      });
    }
  }

  getWeatherAndAirQuality(city: string) {
    this.weatherService.getWeather(city).subscribe(weatherData => {
      this.temperature = weatherData.main.temp;
      const { lat, lon } = weatherData.coord;
      this.weatherService.getAirQuality(lat, lon).subscribe(airData => {
        const aqi = airData.list[0].main.aqi;
        this.airQuality = this.getAirQualityDescription(aqi);
      });
    }, error => {
      console.error('Error al obtener el clima o la calidad del aire:', error);
    });
  }

  getAirQualityDescription(aqi: number): string {
    switch (aqi) {
      case 1: return 'Buena';
      case 2: return 'Moderada';
      case 3: return 'Dañina para grupos sensibles';
      case 4: return 'Dañina';
      case 5: return 'Muy dañina';
      default: return 'Desconocida';
    }
  }

  async takePhoto() {
    await this.photoService.addNewPhoto();
  }

  async startScan() {
    const permission = await BarcodeScanner.checkPermission({ force: true });
    if (permission.granted) {
      BarcodeScanner.hideBackground();
      const result = await BarcodeScanner.startScan();
      if (result.hasContent) {
        this.showAlert(result.content);
      }
    } else {
      console.error('No se concedieron permisos para el escáner');
    }
  }

  async showAlert(content: string) {
    const alert = await this.alertController.create({
      header: 'Contenido del QR',
      message: content,
      buttons: ['OK']
    });
    await alert.present();
  }

  stopScan() {
    BarcodeScanner.stopScan();
  }

  loadTodayClasses() {
    this.clasesHoy = this.asignaturaService.getAsignaturasPorDia(this.nombreDia);
  }

  cerrarSesion() {
    this.afAuth.signOut().then(() => {
      localStorage.removeItem('ingresado');
      localStorage.removeItem('datosPersonales');
      this.navCtrl.navigateRoot('login');
    }).catch((error) => {
      console.error('Error al cerrar sesión: ', error);
    });
  }

  doRefresh(event: any) {
    this.updateDate();
    this.loadPersonalData();
    this.getWeatherAndAirQuality('Santiago');
    this.loadTodayClasses();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}
