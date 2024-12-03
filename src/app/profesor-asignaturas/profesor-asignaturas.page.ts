import { Component, OnInit } from '@angular/core';
import { AsignaturaService } from '../services/asignatura.service';
import { AuthService } from '../services/auth.service';
import { Asignatura } from '../models/asignatura.model';
import { AlertController, NavController, ModalController, LoadingController } from '@ionic/angular';
import { QrModalComponent } from '../qr-modal/qr-modal.component';

@Component({
  selector: 'app-profesor-asignaturas',
  templateUrl: './profesor-asignaturas.page.html',
  styleUrls: ['./profesor-asignaturas.page.scss'],
})
export class ProfesorAsignaturasPage implements OnInit {
  asignaturas: Asignatura[] = [];

  constructor(
    private asignaturaService: AsignaturaService,
    private authService: AuthService,
    private alertController: AlertController,
    private navCtrl: NavController,
    private modalController: ModalController,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    const userEmail = await this.authService.getCurrentUserEmail();
    if (userEmail) {
      this.asignaturas = this.asignaturaService.getAsignaturasPorProfesor(userEmail);
    }
  }

  async generarQR(asignatura: Asignatura) {
    const loading = await this.loadingController.create({
      message: 'Generando código QR...',
      spinner: 'crescent',
    });
    await loading.present();
  
    try {
      const fechaHoy = new Date().toLocaleDateString('es-ES').replace(/\//g, '-'); // Formato dd-mm-yyyy
      const qrData = `${asignatura.sigla}|${asignatura.seccion}|${asignatura.sala}|${fechaHoy}`;
  
      console.log('Datos de QR generados:', qrData);
  
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
      await this.openQrModal(qrApiUrl);
    } catch (error) {
      console.error('Error al generar el QR:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un problema al generar el código QR. Inténtalo nuevamente.',
        buttons: ['OK'],
      });
      await alert.present();
    } finally {
      await loading.dismiss();
    }
  }
  
  
  

  async openQrModal(qrUrl: string) {
    const modal = await this.modalController.create({
      component: QrModalComponent,
      componentProps: { qrUrl: qrUrl },
    });
    await modal.present();
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
              await this.authService.logout();
              localStorage.removeItem('ingresado');
              localStorage.removeItem('datosPersonales');
              this.navCtrl.navigateRoot('/login');
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
}
