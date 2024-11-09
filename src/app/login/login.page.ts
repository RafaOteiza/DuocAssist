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
<<<<<<< Updated upstream
      'email': new FormControl("", [Validators.required, Validators.email]),
      'password': new FormControl("", Validators.required)
=======
      email: new FormControl("", [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl("", Validators.required),
>>>>>>> Stashed changes
    });
  }

  ngOnInit() {}

  async ingresar() {
    const { email, password } = this.formularioLogin.value;

<<<<<<< Updated upstream
=======
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

>>>>>>> Stashed changes
    try {
      console.log('Intentando iniciar sesión con:', email); // Verifica que el email es correcto
      await this.authService.login(email, password); // Ejecuta el inicio de sesión

<<<<<<< Updated upstream
      // Verificar si el token está guardado en localStorage
      const token = localStorage.getItem('userToken');
      if (token) {
        console.log('Token almacenado en localStorage:', token); // Confirmación de que el token se guardó
      } else {
        console.error('El token no se guardó en localStorage'); // Mensaje si algo salió mal
      }

      this.navCtrl.navigateRoot('inicio'); // Redirigir al inicio si todo va bien
=======
      // Redireccionar según el tipo de correo
      if (email.endsWith('@profesor.duoc.cl')) {
        this.navCtrl.navigateRoot('profesor-asignaturas'); // Redirige a la vista de profesor
      } else {
        this.navCtrl.navigateRoot('inicio'); // Redirige a la vista de alumno
      }

>>>>>>> Stashed changes
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
