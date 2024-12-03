import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, AlertController, ModalController, LoadingController } from '@ionic/angular';
import { PhotosService } from '../photos.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { WeatherService } from '../services/weather.service';
import { AsignaturaService } from '../services/asignatura.service';
import { AsistenciaService } from '../services/asistencia.service';
import { Asignatura } from '../models/asignatura.model';
import { IonDatetimeModalComponent } from '../ion-datetime-modal/ion-datetime-modal.component';
import { QrService } from '../services/qr.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit, OnDestroy {
  nombreUsuario: string = '';
  apellidoUsuario: string = '';
  fechaHoy!: string;
  nombreDia!: string;
  selectedDate!: string;
  photos: string[] = [];
  temperature: number | null = null;
  airQuality: string = '';
  clasesHoy: Asignatura[] = [];
  private backButtonSubscription: any;

  constructor(
    public navCtrl: NavController,
    private photoService: PhotosService,
    private afAuth: AngularFireAuth,
    private weatherService: WeatherService,
    private alertController: AlertController,
    private asignaturaService: AsignaturaService,
    private modalController: ModalController,
    private asistenciaService: AsistenciaService,
    public qrService: QrService,
    private platform: Platform,
    private loadingController: LoadingController // Agregado para el LoadingController
  ) {
    this.photos = this.photoService.photos;
  }

  ngOnInit() {
    this.updateDate();
    this.loadPersonalData();
    this.getWeatherAndAirQuality('Santiago');
    this.loadTodayClasses();

    // Manejo del botón de retroceso de Android
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(
      10,
      async () => {
        if (this.qrService.scan) {
          this.qrService.StopScan(); // Detener el escaneo
          const loading = await this.loadingController.getTop();
          if (loading) {
            await loading.dismiss(); // Asegurarse de que el loading se cierre
          }
          this.navCtrl.navigateRoot('/inicio'); // Navegar al inicio
        }
      }
    );
  }

  ngOnDestroy() {
    // Cancelar la suscripción al botón de hardware
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
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
    const loading = await this.loadingController.create({
      message: 'Escanee el código QR', // Cambiado el mensaje
      spinner: 'circles',
      cssClass: 'custom-loading-class', // Clase personalizada para mover el loading hacia abajo
    });

    await loading.present();

    // Variable para evitar que se muestren múltiples mensajes
    let isTimeoutHandled = false;

    // Iniciar un temporizador de 15 segundos
    const timeout = setTimeout(async () => {
      if (!isTimeoutHandled && this.qrService.scan) {
        isTimeoutHandled = true; // Prevenir que el mensaje se muestre más de una vez
        this.qrService.StopScan(); // Detener el escaneo
        await loading.dismiss(); // Cerrar el loading
        const alert = await this.alertController.create({
          header: 'Tiempo agotado',
          message: 'El escaneo ha excedido el tiempo permitido. Por favor, inténtalo nuevamente.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    }, 15000); // 15 segundos

    try {
      document.body.classList.add('scanner-active');
      await this.qrService.StartScan();
      document.body.classList.remove('scanner-active');

      if (this.qrService.scanResult) {
        clearTimeout(timeout); // Limpiar el temporizador si el escaneo fue exitoso
        isTimeoutHandled = true; // Marcar que el timeout fue manejado
        await this.registrarAsistenciaDesdeQR(this.qrService.scanResult);
      } else {
        console.error('Escaneo fallido o cancelado.');
      }
    } catch (error) {
      console.error('Error al escanear:', error);
      if (!isTimeoutHandled) {
        isTimeoutHandled = true; // Prevenir conflicto con el timeout
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Hubo un problema al escanear el código. Inténtalo nuevamente.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    } finally {
      clearTimeout(timeout); // Asegurar que el temporizador se limpie
      await loading.dismiss(); // Cerrar el loading
    }
  }

  async registrarAsistenciaDesdeQR(qrData: string) {
    try {
      const [sigla, seccion, sala, fecha] = qrData.split('|').map((d) => d.trim());
  
      console.log('Datos procesados del QR:', { sigla, seccion, sala, fecha });
  
      const asignatura = this.asignaturaService.getAsignaturaPorSigla(sigla);
      if (!asignatura) {
        throw new Error('Asignatura no encontrada para la sigla proporcionada.');
      }
  
      await this.asistenciaService.registrarAsistencia(
        asignatura.nombre,
        sigla,
        seccion,
        sala
      );
  
      await this.showAlert('Asistencia Registrada', 'La asistencia ha sido registrada exitosamente.');
    } catch (error) {
      await this.showAlert('Error', error.message || 'Hubo un problema al registrar la asistencia. Inténtalo nuevamente.');
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

  loadTodayClasses() {
    const anioActual = new Date().getFullYear();
    const mesActual = new Date().getMonth() + 1;
    this.clasesHoy = this.asignaturaService.getAsignaturasPorDiaYAnio(this.nombreDia, anioActual, mesActual);
  }

  loadClassesBySelectedDate(dateString: string) {
    const date = new Date(dateString);
    const dayOfWeek = date.toLocaleDateString('es-ES', { weekday: 'long' });
    const selectedYear = date.getFullYear();
    const selectedMonth = date.getMonth() + 1;

    this.clasesHoy = this.asignaturaService.getAsignaturasPorDiaYAnio(dayOfWeek, selectedYear, selectedMonth);
  }

  async cerrarSesion() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cierre de sesión cancelado.');
          },
        },
        {
          text: 'Cerrar sesión',
          handler: async () => {
            try {
              await this.afAuth.signOut(); // Cerrar sesión en Firebase
              localStorage.removeItem('ingresado');
              localStorage.removeItem('datosPersonales');
              this.navCtrl.navigateRoot('/login'); // Redirigir al login
              console.log('Sesión cerrada con éxito.');
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
            }
          },
        },
      ],
    });
  
    await alert.present();
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
