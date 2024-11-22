import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { PhotosService } from '../photos.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { WeatherService } from '../services/weather.service';
import { AsignaturaService } from '../services/asignatura.service';
import { AsistenciaService } from '../services/asistencia.service';
import { Asignatura } from '../models/asignatura.model';
import { IonDatetimeModalComponent } from '../ion-datetime-modal/ion-datetime-modal.component';
import { QrService } from '../services/qr.service';

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
  selectedDate!: string;
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
    private asignaturaService: AsignaturaService,
    private modalController: ModalController,
    private asistenciaService: AsistenciaService,
    public qrService: QrService
  ) {
    this.photos = this.photoService.photos;
  }

  ngOnInit() {
    this.updateDate();
    this.loadPersonalData();
    this.getWeatherAndAirQuality('Santiago');
    this.loadTodayClasses();
  }

  updateDate() {
    const hoy = new Date();
    this.fechaHoy = hoy.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    this.nombreDia = hoy.toLocaleDateString('es-ES', { weekday: 'long' });
  }

  loadPersonalData() {
    const datosPersonales = JSON.parse(localStorage.getItem('datosPersonales') || '{}');
    if (datosPersonales && datosPersonales.nombre) {
      this.nombreUsuario = datosPersonales.nombre;
      this.apellidoUsuario = datosPersonales.apellido || '';
    } else {
      this.afAuth.authState.subscribe((user) => {
        if (user && user.email) {
          this.nombreUsuario = user.email.split('@')[0];
        }
      });
    }
  }

  getWeatherAndAirQuality(city: string) {
    this.weatherService.getWeather(city).subscribe(
      (weatherData) => {
        this.temperature = weatherData.main.temp;
        const { lat, lon } = weatherData.coord;
        this.weatherService.getAirQuality(lat, lon).subscribe((airData) => {
          const aqi = airData.list[0].main.aqi;
          this.airQuality = this.getAirQualityDescription(aqi);
        });
      },
      (error) => {
        console.error('Error al obtener el clima o la calidad del aire:', error);
      }
    );
  }

  getAirQualityDescription(aqi: number): string {
    switch (aqi) {
      case 1:
        return 'Buena';
      case 2:
        return 'Moderada';
      case 3:
        return 'Dañina para grupos sensibles';
      case 4:
        return 'Dañina';
      case 5:
        return 'Muy dañina';
      default:
        return 'Desconocida';
    }
  }

  async takePhoto() {
    await this.photoService.addNewPhoto();
  }

  async startQrScan() {
    try {
      document.body.classList.add('scanner-active');
      await this.qrService.StartScan();
      document.body.classList.remove('scanner-active');

      if (this.qrService.scanResult) {
        this.registrarAsistenciaDesdeQR(this.qrService.scanResult);
      } else {
        console.error('Escaneo fallido o cancelado.');
      }
    } catch (error) {
      console.error('Error al escanear:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un problema al escanear el código. Inténtalo nuevamente.',
        buttons: ['OK'],
      });
      await alert.present();
      document.body.classList.remove('scanner-active');
    }
  }

  async registrarAsistenciaDesdeQR(qrData: string) {
    try {
      const [asignatura, seccion, sala] = qrData.split('|').map((d) => d.trim());
      await this.asistenciaService.registrarAsistencia(asignatura, seccion, sala);

      await this.showAlert('Asistencia Registrada', 'La asistencia ha sido registrada exitosamente.');
    } catch (error) {
      await this.showAlert('Error', 'Hubo un problema al registrar la asistencia. Inténtalo nuevamente.');
      console.error('Error al registrar la asistencia:', error);
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async openCalendar() {
    const modal = await this.modalController.create({
      component: IonDatetimeModalComponent,
      componentProps: {
        fechaSeleccionada: this.selectedDate,
      },
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.selectedDate = data.selectedDate;
      this.loadClassesBySelectedDate(this.selectedDate);
    }
  }

  loadClassesBySelectedDate(dateString: string) {
    const date = new Date(dateString);
    const dayOfWeek = date.toLocaleDateString('es-ES', { weekday: 'long' });
    this.clasesHoy = this.asignaturaService.getAsignaturasPorDia(dayOfWeek);
  }

  loadTodayClasses() {
    this.clasesHoy = this.asignaturaService.getAsignaturasPorDia(this.nombreDia);
  }

  cerrarSesion() {
    this.afAuth.signOut()
      .then(() => {
        localStorage.removeItem('ingresado');
        localStorage.removeItem('datosPersonales');
        this.navCtrl.navigateRoot('/login');
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error);
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
