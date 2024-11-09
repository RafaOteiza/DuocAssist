import { Injectable } from '@angular/core';
import { Asignatura } from '../models/asignatura.model';

@Injectable({
  providedIn: 'root',
})
export class AsignaturaService {
  private asignaturas: Asignatura[] = [
    { dia: 'Lunes', horario: '19:00 - 20:20', nombre: 'Programación de Aplicaciones Móviles', seccion: 'PGY4121', sala: 'SJ-L7', profesorEmail: 'cmartinez@profesor.duoc.cl' },
    { dia: 'Lunes', horario: '20:30 - 21:50', nombre: 'Inglés Intermedio', seccion: 'INI5111', sala: 'SJ-604', profesorEmail: 'otroprofesor@profesor.duoc.cl' },
    { dia: 'Martes', horario: '17:30 - 18:50', nombre: 'Musculación y Pesas Miércoles', seccion: 'MUSM', sala: 'Gimnasio Sede SJ', profesorEmail: 'otroprofesor@profesor.duoc.cl' },
    { dia: 'Martes', horario: '19:00 - 21:10', nombre: 'Programación de Aplicaciones Móviles', seccion: 'PGY4121', sala: 'SJ-L7', profesorEmail: 'carlos.martinez@profesor.duoc.cl' },
    { dia: 'Martes', horario: '21:10 - 22:30', nombre: 'Inglés Intermedio', seccion: 'INI5111', sala: 'SJ-604', profesorEmail: 'otroprofesor@profesor.duoc.cl' },
    { dia: 'Miércoles', horario: '19:00 - 20:20', nombre: 'Estadística Descriptiva', seccion: 'MAT4140', sala: 'SJ-L4', profesorEmail: 'otroprofesor@profesor.duoc.cl' },
    { dia: 'Miércoles', horario: '20:30 - 21:50', nombre: 'Inglés Intermedio', seccion: 'INI5111', sala: 'SJ-604', profesorEmail: 'otroprofesor@profesor.duoc.cl' },
    { dia: 'Jueves', horario: '17:30 - 18:50', nombre: 'Musculación y Pesas Jueves', seccion: 'MUSJ', sala: 'Gimnasio Sede SJ', profesorEmail: 'otroprofesor@profesor.duoc.cl' },
    { dia: 'Jueves', horario: '19:00 - 20:20', nombre: 'Programación de Aplicaciones Móviles', seccion: 'PGY4121', sala: 'SJ-L7', profesorEmail: 'carlos.martinez@profesor.duoc.cl' },
    { dia: 'Jueves', horario: '20:30 - 21:10', nombre: 'Calidad de Software', seccion: 'CSY4111', sala: 'SJ-L8', profesorEmail: 'otroprofesor@profesor.duoc.cl' },
    { dia: 'Jueves', horario: '21:10 - 22:30', nombre: 'Inglés Intermedio', seccion: 'INI5111', sala: 'SJ-604', profesorEmail: 'otroprofesor@profesor.duoc.cl' },
    { dia: 'Viernes', horario: '19:00 - 20:20', nombre: 'Estadística Descriptiva', seccion: 'MAT4140', sala: 'SJ-L4', profesorEmail: 'otroprofesor@profesor.duoc.cl' },
    { dia: 'Viernes', horario: '20:30 - 22:30', nombre: 'Calidad de Software', seccion: 'CSY4111', sala: 'SJ-L9', profesorEmail: 'otroprofesor@profesor.duoc.cl' },
    { dia: 'Sábado', horario: '13:00 - 14:20', nombre: 'Arquitectura', seccion: 'ASY4131', sala: 'SJ-L6', profesorEmail: 'otroprofesor@profesor.duoc.cl' }
  ];

  constructor() {}

  getAsignaturasPorDia(dia: string): Asignatura[] {
    return this.asignaturas.filter(asignatura => asignatura.dia.toLowerCase() === dia.toLowerCase());
  }

  // Método para obtener asignaturas por correo de profesor y nombre específico
  getAsignaturasPorProfesor(email: string): Asignatura[] {
    return this.asignaturas.filter(
      asignatura => asignatura.profesorEmail === email && asignatura.nombre === 'Programación de Aplicaciones Móviles'
    );
  }
}
