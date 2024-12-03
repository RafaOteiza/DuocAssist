import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AsistenciaService {
  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) {}

  async registrarAsistencia(nombreAsignatura: string, sigla: string, seccion: string, sala: string) {
    const user = await this.afAuth.currentUser;
    if (user) {
      const alumnoID = user.email;
  
      // Tiempo límite (40 minutos atrás)
      const ahora = new Date();
      const hace40Minutos = new Date(ahora.getTime() - 40 * 60 * 1000);
  
      // Verificar si ya existe un registro reciente de la misma sigla y sección
      const reciente = await this.firestore
        .collection('asistencias', (ref) =>
          ref
            .where('alumnoID', '==', alumnoID)
            .where('sigla', '==', sigla)
            .where('seccion', '==', seccion)
            .where('fechaEscaneo', '>=', hace40Minutos)
        )
        .get()
        .toPromise();
  
      if (!reciente.empty) {
        throw new Error(`Ya has registrado tu asistencia para la asignatura ${nombreAsignatura} hace menos de 40 minutos.`);
      }
  
      const asistenciaData = {
        alumnoID,
        nombreAsignatura,
        sigla,
        seccion,
        sala,
        fechaEscaneo: new Date(),
      };
  
      return this.firestore.collection('asistencias').add(asistenciaData);
    } else {
      throw new Error('No se pudo obtener la información del usuario.');
    }
  }
  


  obtenerAsistenciasAlumno(alumnoID: string): Observable<any[]> {
    return this.firestore
      .collection('asistencias', (ref) => ref.where('alumnoID', '==', alumnoID))
      .valueChanges();
  }
}
