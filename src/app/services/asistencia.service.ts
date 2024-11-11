import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) {}

  async registrarAsistencia(asignatura: string, seccion: string, sala: string) {
    const user = await this.afAuth.currentUser;
    if (user) {
      const alumnoID = user.email;

      const asistenciaData = {
        alumnoID,
        asignatura,
        seccion,
        sala,
        fechaEscaneo: new Date()
      };

      return this.firestore.collection('asistencias').add(asistenciaData);
    } else {
      throw new Error('No se pudo obtener la información del usuario');
    }
  }

  obtenerAsistenciasAlumno(alumnoID: string): Observable<any[]> {
    return this.firestore
      .collection('asistencias', ref => ref.where('alumnoID', '==', alumnoID))
      .valueChanges();
  }
}
