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
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@duocuc\.cl$/), // Permitir solo correos con @duocuc.cl
      ]),
      password: new FormControl("", Validators.required),
    });
  }

  ngOnInit() {}

  async ingresar() {
    const { email, password } = this.formularioLogin.value;

    // Verificar que el correo tiene el dominio correcto
    if (!this.formularioLogin.get('email')?.valid) {
      const alert = await this.alertController.create({
        header: 'Correo Inválido',
        message: 'Solo se permiten correos electrónicos @duocuc.cl',
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

      this.navCtrl.navigateRoot('inicio');
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
