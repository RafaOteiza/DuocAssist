import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';
import { CambiarContrasenaComponent } from '../components/cambiar-contrasena/cambiar-contrasena.component';
import { LocalNotifications } from '@capacitor/local-notifications';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
})
export class AjustesPage implements OnInit {
  paletteToggle = false; // Estado del tema oscuro

  constructor(
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    const storedThemePreference = localStorage.getItem('darkMode');
    if (storedThemePreference) {
      this.paletteToggle = JSON.parse(storedThemePreference);
      this.toggleDarkMode(this.paletteToggle);
    }
  }

  toggleChange(ev: any) {
    this.paletteToggle = ev.detail.checked;
    localStorage.setItem('darkMode', JSON.stringify(this.paletteToggle));
    this.toggleDarkMode(this.paletteToggle);
  }

  toggleDarkMode(shouldAdd: boolean) {
    if (shouldAdd) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  irADatosPersonales() {
    this.router.navigate(['/personal-data']);
  }

  async abrirModalCambiarContrasena() {
    const modal = await this.modalController.create({
      component: CambiarContrasenaComponent,
    });

    modal.onDidDismiss().then(async (data) => {
      if (data?.data?.nuevaContrasena) {
        await this.actualizarContrasenaEnFirebase(data.data.nuevaContrasena);
      }
    });

    await modal.present();
  }

  async actualizarContrasenaEnFirebase(nuevaContrasena: string) {
    const user = await this.afAuth.currentUser;

    if (user) {
      try {
        // Cambiar la contraseña en Firebase
        await user.updatePassword(nuevaContrasena);

        // Cerrar sesión para forzar autenticación con la nueva contraseña
        await this.afAuth.signOut();

        const alert = await this.alertController.create({
          header: 'Éxito',
          message:
            'Contraseña actualizada correctamente. Por favor, inicia sesión nuevamente con tu nueva contraseña.',
          buttons: ['Aceptar'],
        });
        await alert.present();

        // Redirigir al login
        this.router.navigate(['/login']);
      } catch (error) {
        console.error('Error al cambiar contraseña:', error);

        let errorMessage = 'No se pudo cambiar la contraseña.';
        if (error.code === 'auth/requires-recent-login') {
          errorMessage =
            'Tu sesión es antigua. Por seguridad, cierra sesión e inicia nuevamente para cambiar la contraseña.';
        }

        const alert = await this.alertController.create({
          header: 'Error',
          message: errorMessage,
          buttons: ['Aceptar'],
        });
        await alert.present();
      }
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message:
          'Usuario no autenticado. Por favor, cierra sesión e inicia nuevamente.',
        buttons: ['Aceptar'],
      });
      await alert.present();
    }
  }

  async notificarProximaClase() {
    try {
      await LocalNotifications.requestPermissions();
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 1,
            title: 'Próxima Clase',
            body: 'Recuerda tu clase programada.',
            schedule: { at: new Date(new Date().getTime() + 5000) },
          },
        ],
      });
      console.log('Notificación de próxima clase programada');
    } catch (error) {
      console.error('Error al programar notificación:', error);
    }
  }

  async notificarRegistroAsistencia() {
    try {
      await LocalNotifications.requestPermissions();
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 2,
            title: 'Asistencia Registrada',
            body: 'Se ha registrado tu asistencia correctamente.',
            schedule: { at: new Date(new Date().getTime() + 5000) },
          },
        ],
      });
      console.log('Notificación de registro de asistencia programada');
    } catch (error) {
      console.error('Error al programar notificación:', error);
    }
  }

  async mostrarAcercaDe() {
    const alert = await this.alertController.create({
      header: 'Acerca de',
      message:
        'Aplicación creada por alumnos: Luis Arenas, Matías Garrido y Rafael Oteiza para el ramo de Programación de Aplicaciones Móviles.',
      buttons: ['OK'],
    });
    await alert.present();
  }
}
