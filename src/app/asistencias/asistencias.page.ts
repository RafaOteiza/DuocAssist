import { Component, OnInit } from '@angular/core';
import { AsistenciaService } from '../services/asistencia.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-asistencias',
  templateUrl: './asistencias.page.html',
  styleUrls: ['./asistencias.page.scss'],
})
export class AsistenciasPage implements OnInit {
  asistencias: any[] = [];

  constructor(
    private asistenciaService: AsistenciaService,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user && user.email) {
        this.cargarAsistencias(user.email);
      }
    });
  }

  cargarAsistencias(alumnoID: string) {
    this.asistenciaService.obtenerAsistenciasAlumno(alumnoID).subscribe(data => {
      this.asistencias = data;
    });
  }
}
