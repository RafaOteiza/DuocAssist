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

  constructor(
    public fb: FormBuilder,
    public alertController: AlertController,
    public navCtrl: NavController,
    private authService: AuthService
  ) {
    this.formularioLogin = this.fb.group({
      email: new FormControl("", [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl("", Validators.required),
    });
  }

  ngOnInit() {}

  async ingresar() {
    const { email, password } = this.formularioLogin.value;

    // Verificar dominio del correo en login
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
      console.log('Intentando iniciar sesión con:', email);
      await this.authService.login(email, password);

      const token = localStorage.getItem('userToken');
      if (token) {
        console.log('Token almacenado en localStorage:', token);
      } else {
        console.error('El token no se guardó en localStorage');
      }

      // Redireccionar según el tipo de correo
      if (email.endsWith('@profesor.duoc.cl')) {
        this.navCtrl.navigateRoot('profesor-asignaturas'); // Redirige a la vista de profesor
      } else {
        this.navCtrl.navigateRoot('inicio'); // Redirige a la vista de alumno
      }
    } catch (error: any) {
      console.error('Error durante el inicio de sesión:', error);
      const alert = await this.alertController.create({
        header: '¡Error!',
        message: error?.message || 'Ocurrió un error desconocido.',
        buttons: ['Aceptar'],
      });
      await alert.present();
    }
  }
}

