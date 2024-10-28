import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service'; // Ajuste de la ruta del AuthService

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
      'email': new FormControl("", [Validators.required, Validators.email]),
      'password': new FormControl("", Validators.required)
    });
  }

  ngOnInit() {}

  async ingresar() {
    const { email, password } = this.formularioLogin.value;

    try {
      console.log('Intentando iniciar sesión con:', email); // Verifica que el email es correcto
      await this.authService.login(email, password); // Ejecuta el inicio de sesión

      // Verificar si el token está guardado en localStorage
      const token = localStorage.getItem('userToken');
      if (token) {
        console.log('Token almacenado en localStorage:', token); // Confirmación de que el token se guardó
      } else {
        console.error('El token no se guardó en localStorage'); // Mensaje si algo salió mal
      }

      this.navCtrl.navigateRoot('inicio'); // Redirigir al inicio si todo va bien
    } catch (error: any) {
      console.error('Error durante el inicio de sesión:', error); // Muestra el error en consola
      const alert = await this.alertController.create({
        header: '¡Error!',
        message: error?.message || 'Ocurrió un error desconocido.',
        buttons: ['Aceptar']
      });
      await alert.present();
    }
  }
}
