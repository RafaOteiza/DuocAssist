import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  formularioLogin: FormGroup;
  recordarUsuario: boolean = false;

  constructor(
    public fb: FormBuilder,
    public alertController: AlertController,
    public navCtrl: NavController,
    private authService: AuthService
  ) {
    this.formularioLogin = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuarioGuardado') || '{}');
    if (usuarioGuardado?.email && usuarioGuardado?.password) {
      this.formularioLogin.patchValue(usuarioGuardado);
      this.recordarUsuario = true;
    }
  }

  async ingresar() {
    const { email, password } = this.formularioLogin.value;

    if (!email.endsWith('@duocuc.cl') && !email.endsWith('@profesor.duoc.cl')) {
      const alert = await this.alertController.create({
        header: 'Correo Inválido',
        message: 'Solo se permiten correos electrónicos @duocuc.cl y @profesor.duoc.cl',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }

    try {
      await this.authService.login(email, password);

      if (this.recordarUsuario) {
        localStorage.setItem('usuarioGuardado', JSON.stringify({ email, password }));
      } else {
        localStorage.removeItem('usuarioGuardado');
      }

      console.log('Inicio de sesión exitoso');
    } catch (error: any) {
      const alert = await this.alertController.create({
        header: '¡Error!',
        message: error || 'Ocurrió un error al iniciar sesión. Inténtalo nuevamente.',
        buttons: ['Aceptar'],
      });
      await alert.present();
    }
  }
}
