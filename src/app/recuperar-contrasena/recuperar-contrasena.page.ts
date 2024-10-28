import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.page.html',
  styleUrls: ['./recuperar-contrasena.page.scss'],
})
export class RecuperarContrasenaPage implements OnInit {
  formularioRecuperar: FormGroup;

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private alertController: AlertController
  ) {
    this.formularioRecuperar = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {}

  async enviar() {
    const email = this.formularioRecuperar.get('email')?.value;

    try {
      await this.afAuth.sendPasswordResetEmail(email);
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Correo de recuperación enviado. Revisa tu bandeja de entrada.',
        buttons: ['OK']
      });
      await alert.present();
    } catch (error: any) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: error.message || 'Ocurrió un error al enviar el correo de recuperación.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
