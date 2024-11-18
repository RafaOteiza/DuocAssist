import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  formularioRecuperar: FormGroup;

  constructor(
    public fb: FormBuilder, 
    public alertController: AlertController,
    public navCtrl: NavController,
    private afAuth: AngularFireAuth
  ) { 
    this.formularioRecuperar = this.fb.group({
      'nombre': new FormControl("", [Validators.required, Validators.email]), // Aquí 'nombre' representa el email
      'password': new FormControl("", Validators.required),
      'confirmacionPassword': new FormControl("", Validators.required),
    }, { validator: this.passwordMatchValidator });  
  }

  ngOnInit() {}

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmacionPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  async recuperar() {
    const { nombre, password } = this.formularioRecuperar.value;

    if (this.formularioRecuperar.invalid) {
      const alert = await this.alertController.create({
        header: '¡Error!',
        message: 'Por favor, asegúrate de que las contraseñas coincidan y que todos los campos estén completos.',
        buttons: ['Aceptar']
      });
      await alert.present();
      return;
    }

    // Verificación del dominio del correo
    if (!nombre.endsWith('@duocuc.cl')) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Solo los correos institucionales (@duocuc.cl) pueden registrarse.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(nombre, password);
      const alert = await this.alertController.create({
        header: '¡Registro Exitoso!',
        message: 'Usuario registrado correctamente.',
        buttons: ['Aceptar']
      });
      await alert.present();
      this.navCtrl.navigateRoot('login');
    } catch (error: any) {
      const alert = await this.alertController.create({
        header: '¡Error!',
        message: error.message || 'Ocurrió un error.',
        buttons: ['Aceptar']
      });
      await alert.present();
    }
  }
}
