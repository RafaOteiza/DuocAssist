import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service'; // Servicio de autenticación para obtener el correo del usuario

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.page.html',
  styleUrls: ['./personal-data.page.scss'],
})
export class PersonalDataPage implements OnInit {
  nombre: string = '';
  apellido: string = '';
  correo: string = ''; // Correo del usuario autenticado
  telefono: string = '';
  sexo: string = '';
  carrera: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService // Servicio para obtener información del usuario
  ) {}

  async ngOnInit() {
    // Obtener el correo del usuario autenticado y cargarlo
    try {
      const userEmail = await this.authService.getCurrentUserEmail(); // Método para obtener el correo
      this.correo = userEmail || ''; // Mostrar correo del usuario si está disponible
    } catch (error) {
      console.error('Error al obtener el correo del usuario:', error);
    }

    // Cargar datos personales desde localStorage
    const datosPersonales = JSON.parse(localStorage.getItem('datosPersonales') || '{}');
    if (datosPersonales) {
      this.nombre = datosPersonales.nombre || '';
      this.apellido = datosPersonales.apellido || '';
      this.telefono = datosPersonales.telefono || '';
      this.sexo = datosPersonales.sexo || '';
      this.carrera = datosPersonales.carrera || '';
    }
  }

  async presentAlertSexo() {
    const alert = await this.alertController.create({
      header: 'Seleccionar Sexo',
      inputs: [
        {
          name: 'masculino',
          type: 'radio',
          label: 'Masculino',
          value: 'Masculino',
          checked: this.sexo === 'Masculino',
        },
        {
          name: 'femenino',
          type: 'radio',
          label: 'Femenino',
          value: 'Femenino',
          checked: this.sexo === 'Femenino',
        },
        {
          name: 'otro',
          type: 'radio',
          label: 'Otro',
          value: 'Otro',
          checked: this.sexo === 'Otro',
        },
        {
          name: 'no-decidir',
          type: 'radio',
          label: 'Prefiero no decir',
          value: 'Prefiero no decir',
          checked: this.sexo === 'Prefiero no decir',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          handler: (selectedValue) => {
            this.sexo = selectedValue;
          },
        },
      ],
    });

    await alert.present();
  }

  guardarDatosPersonales() {
    const datosPersonales = {
      nombre: this.nombre,
      apellido: this.apellido,
      telefono: this.telefono,
      sexo: this.sexo,
      carrera: this.carrera,
    };

    // Guardar en localStorage
    localStorage.setItem('datosPersonales', JSON.stringify(datosPersonales));
    console.log('Datos personales guardados:', datosPersonales);

    // Navegar de vuelta al inicio
    this.router.navigate(['/inicio']);
  }

  volverAlMenu() {
    this.router.navigate(['/inicio']);
  }
}
