import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PhotosService } from '../photos.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { WeatherService } from '../services/weather.service'; // Importa el servicio del clima

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
  temperature: number | null = null; // Variable para almacenar la temperatura en Celsius
  airQuality: string = ''; // Variable para almacenar la calidad del aire

  constructor(
    public navCtrl: NavController,
    private photoService: PhotosService,
    private afAuth: AngularFireAuth, // Servicio de Firebase Auth
    private weatherService: WeatherService // Servicio del clima
  ) {
    this.photos = this.photoService.photos;
  }

  ngOnInit() {
    // Obtener la fecha actual y el nombre del día
    const hoy = new Date();
    this.fechaHoy = hoy.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    this.nombreDia = hoy.toLocaleDateString('es-ES', { weekday: 'long' });

    // Verificar si los datos personales están en localStorage
    const datosPersonales = JSON.parse(localStorage.getItem('datosPersonales') || '{}');
    if (datosPersonales && datosPersonales.nombre) {
      this.nombreUsuario = datosPersonales.nombre;
      this.apellidoUsuario = datosPersonales.apellido || '';
    } else {
      // Obtener el nombre de usuario a partir del correo
      this.afAuth.authState.subscribe(user => {
        if (user && user.email) {
          this.nombreUsuario = user.email.split('@')[0];
        }
      });
    }

    // Obtener los datos de clima y calidad del aire
    this.getWeatherAndAirQuality('Santiago'); // Cambia 'Santiago' por la ciudad deseada
  }

  // Método para obtener el clima y la calidad del aire
  getWeatherAndAirQuality(city: string) {
    this.weatherService.getWeather(city).subscribe(weatherData => {
      this.temperature = weatherData.main.temp;

      // Obtener la calidad del aire usando las coordenadas del clima
      const { lat, lon } = weatherData.coord;
      this.weatherService.getAirQuality(lat, lon).subscribe(airData => {
        const aqi = airData.list[0].main.aqi;
        this.airQuality = this.getAirQualityDescription(aqi);
      });
    }, error => {
      console.error('Error al obtener el clima o la calidad del aire:', error);
    });
  }

  // Método para interpretar el AQI (Air Quality Index)
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

  clasesHoy = [
    {
      titulo: 'PROGRAMACIÓN DE APLICACIONES MÓVILES',
      fecha: '2024-09-05',
      ubicacion: 'SALA SJ-L7',
      descripcion: 'Sección PGY4121'
    },
    {
      titulo: 'ESTADÍSTICA DESCRIPTIVA',
      fecha: '2024-09-05',
      ubicacion: 'SALA SJ-L4',
      descripcion: 'Sección MAT4140'
    }
  ];

  cerrarSesion() {
    // Cerrar sesión en Firebase
    this.afAuth.signOut().then(() => {
      localStorage.removeItem('ingresado');
      localStorage.removeItem('datosPersonales');
      this.navCtrl.navigateRoot('login');
    }).catch((error) => {
      console.error('Error al cerrar sesión: ', error);
    });
  }
}
