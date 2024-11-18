import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.component.html',
  styleUrls: ['./cambiar-contrasena.component.scss'],
})
export class CambiarContrasenaComponent {
  contrasenaActual: string = '';
  nuevaContrasena: string = '';

  constructor(
    private modalController: ModalController,
    private afAuth: AngularFireAuth,
    private alertController: AlertController
  ) {}

  cerrarModal() {
    this.modalController.dismiss();
  }

  async cambiarContrasena() {
    if (!this.nuevaContrasena) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, ingresa la nueva contraseña.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }

    const user = await this.afAuth.currentUser;

    if (user) {
      try {
        // Cambiar contraseña en Firebase
        await user.updatePassword(this.nuevaContrasena);

        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'La contraseña ha sido cambiada correctamente.',
          buttons: ['Aceptar'],
        });
        await alert.present();

        // Cerrar el modal y limpiar los campos
        this.modalController.dismiss();
      } catch (error) {
        console.error('Error al cambiar la contraseña:', error);

        let errorMessage = 'No se pudo cambiar la contraseña.';

        if (error.code === 'auth/requires-recent-login') {
          errorMessage =
            'Tu sesión es antigua. Por favor, cierra sesión e inicia nuevamente para cambiar la contraseña.';
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
        message: 'Usuario no autenticado. Por favor, inicia sesión nuevamente.',
        buttons: ['Aceptar'],
      });
      await alert.present();
    }
  }
}
