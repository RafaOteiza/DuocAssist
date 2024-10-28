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
    private afAuth: AngularFireAuth // Inyectamos el servicio de Firebase Auth
  ) { 
    // Validación de coincidencia de contraseñas
    this.formularioRecuperar = this.fb.group({
      'nombre': new FormControl("", [Validators.required, Validators.email]), // Se asume que 'nombre' es el email
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

    // Verifica si el formulario es inválido
    if (this.formularioRecuperar.invalid) {
      const alert = await this.alertController.create({
        header: '¡Error!',
        message: 'Por favor, asegúrate de que las contraseñas coincidan y que todos los campos estén completos.',
        buttons: ['Aceptar']
      });
      await alert.present();
      return;
    }

    // Registro del usuario en Firebase
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(nombre, password);
      const alert = await this.alertController.create({
        header: '¡Registro Exitoso!',
        message: 'Usuario registrado correctamente.',
        buttons: ['Aceptar']
      });
      await alert.present();
      this.navCtrl.navigateRoot('login');
    } catch (error: any) {  // Usamos 'any' para evitar el problema de tipo unknown
      const alert = await this.alertController.create({
        header: '¡Error!',
        message: error.message || 'Ocurrió un error.',
        buttons: ['Aceptar']
      });
      await alert.present();
    }
  }
}
