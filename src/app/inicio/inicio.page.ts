import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PhotosService } from '../photos.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  nombreUsuario: string = '';
  apellidoUsuario: string = '';
  fechaHoy!: string;
  photos: string[] = [];

  constructor(
    public navCtrl: NavController,
    private photoService: PhotosService,
    private afAuth: AngularFireAuth // Inyectamos el servicio de Firebase Auth
  ) {
    this.photos = this.photoService.photos;
  }

  ngOnInit() {
    const hoy = new Date();
    this.fechaHoy = hoy.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Verificar si los datos personales están en localStorage
    const datosPersonales = JSON.parse(localStorage.getItem('datosPersonales') || '{}');
    if (datosPersonales && datosPersonales.nombre) {
      // Si existen datos personales, los usamos
      this.nombreUsuario = datosPersonales.nombre;
      this.apellidoUsuario = datosPersonales.apellido || ''; // Si el apellido no existe, será vacío
    } else {
      // Si no hay datos personales, obtener el nombre del correo
      this.afAuth.authState.subscribe(user => {
        if (user && user.email) {
          // Extraer el nombre antes de '@' del correo
          this.nombreUsuario = user.email.split('@')[0];
        }
      });
    }
  }

  async takePhoto() {
    await this.photoService.addNewPhoto();
  }

  clasesHoy = [
    {
      titulo: 'PROGRAMACIÓN DE APLICACIONES MÓVILES',
      fecha: '2024-09-05',
      ubicacion: 'SALA SJ-L7',
      descripcion: 'Sección PGY4121'
    },
    {
      titulo: 'ESTADÍSTICA DESCRIPTIVA',
      fecha: '2024-09-05',
      ubicacion: 'SALA SJ-L4',
      descripcion: 'Sección MAT4140'
    }
  ];

  cerrarSesion() {
    // Cerrar sesión en Firebase
    this.afAuth.signOut().then(() => {
      // Eliminar el indicador de que el usuario está autenticado
      localStorage.removeItem('ingresado');
      localStorage.removeItem('datosPersonales'); // Eliminar datos personales al cerrar sesión
      
      // Redirigir al usuario a la página de login
      this.navCtrl.navigateRoot('login');
    }).catch((error) => {
      console.error('Error al cerrar sesión: ', error);
    });
  }
}
