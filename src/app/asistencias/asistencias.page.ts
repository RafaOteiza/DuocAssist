import { Component, OnInit } from '@angular/core';
import { AsistenciaService } from '../services/asistencia.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-asistencias',
  templateUrl: './asistencias.page.html',
  styleUrls: ['./asistencias.page.scss'],
})
export class AsistenciasPage implements OnInit {
  asistencias: any[] = []; // Array para almacenar las asistencias del alumno

  constructor(
    private asistenciaService: AsistenciaService,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    // Suscribirse al estado de autenticación para obtener el email del usuario
    this.afAuth.authState.subscribe((user) => {
      if (user && user.email) {
        this.cargarAsistencias(user.email); // Cargar las asistencias del alumno autenticado
      }
    });
  }

  cargarAsistencias(alumnoID: string) {
    // Obtener las asistencias del servicio y ordenarlas por fecha
    this.asistenciaService.obtenerAsistenciasAlumno(alumnoID).subscribe((data) => {
      this.asistencias = data.sort(
        (a, b) => b.fechaEscaneo.toDate() - a.fechaEscaneo.toDate() // Orden descendente por fecha
      );
    });
  }
}
