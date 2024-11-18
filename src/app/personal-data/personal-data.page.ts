import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.page.html',
  styleUrls: ['./personal-data.page.scss'],
})
export class PersonalDataPage implements OnInit {
  nombre: string = '';
  apellido: string = '';
  correo: string = '';
  telefono: string = '';
  sexo: string = '';
  carrera: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    // Cargar los datos personales desde localStorage si existen
    const datosPersonales = JSON.parse(localStorage.getItem('datosPersonales') || '{}');
    if (datosPersonales) {
      this.nombre = datosPersonales.nombre || '';
      this.apellido = datosPersonales.apellido || '';
      this.correo = datosPersonales.correo || ''; // Asumimos que no se debe cambiar
      this.telefono = datosPersonales.telefono || '';
      this.sexo = datosPersonales.sexo || '';
      this.carrera = datosPersonales.carrera || '';
    }
  }

  guardarDatosPersonales() {
    // Guardar los datos personales en localStorage
    const datosPersonales = {
      nombre: this.nombre,
      apellido: this.apellido,
      correo: this.correo,
      telefono: this.telefono,
      sexo: this.sexo,
      carrera: this.carrera,
    };

    localStorage.setItem('datosPersonales', JSON.stringify(datosPersonales));
    console.log('Datos personales guardados:', datosPersonales);

    // Redirigir al inicio o cualquier otra vista después de guardar
    this.router.navigate(['/inicio']);
  }

  volverAlMenu() {
    // Redirigir al menú principal sin guardar
    this.router.navigate(['/inicio']);
  }
}
