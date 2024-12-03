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
  notificacionClase = false; // Estado del toggle "Próxima Clase"
  notificacionAsistencia = false; // Estado del toggle "Registro Asistencia"

  constructor(
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    // Leer preferencia del tema oscuro
    const storedThemePreference = localStorage.getItem('darkMode');
    if (storedThemePreference) {
      this.paletteToggle = JSON.parse(storedThemePreference);
      this.toggleDarkMode(this.paletteToggle);
    }

    // Leer estados de las notificaciones
    const storedNotificacionClase = localStorage.getItem('notificacionClase');
    const storedNotificacionAsistencia = localStorage.getItem('notificacionAsistencia');

    this.notificacionClase = storedNotificacionClase === 'true';
    this.notificacionAsistencia = storedNotificacionAsistencia === 'true';
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

  toggleNotificacionProximaClase(isEnabled: boolean) {
    this.notificacionClase = isEnabled;
    localStorage.setItem('notificacionClase', JSON.stringify(isEnabled));

    if (isEnabled) {
      this.programarNotificacionProximaClase();
    } else {
      this.cancelarNotificacion(1); // ID 1 para "Próxima Clase"
    }
  }

  toggleNotificacionRegistroAsistencia(isEnabled: boolean) {
    this.notificacionAsistencia = isEnabled;
    localStorage.setItem('notificacionAsistencia', JSON.stringify(isEnabled));

    if (isEnabled) {
      this.programarNotificacionRegistroAsistencia();
    } else {
      this.cancelarNotificacion(2); // ID 2 para "Registro Asistencia"
    }
  }

  async programarNotificacionProximaClase() {
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

  async programarNotificacionRegistroAsistencia() {
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

  async cancelarNotificacion(notificationId: number) {
    try {
      await LocalNotifications.cancel({ notifications: [{ id: notificationId }] });
      console.log(`Notificación con ID ${notificationId} cancelada`);
    } catch (error) {
      console.error('Error al cancelar notificación:', error);
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
