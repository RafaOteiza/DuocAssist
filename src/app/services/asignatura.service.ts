import { Injectable } from '@angular/core';
import { Asignatura } from '../models/asignatura.model';

@Injectable({
  providedIn: 'root',
})
export class AsignaturaService {
  private asignaturas: Asignatura[] = [
    { dia: 'Lunes', horario: '19:00 - 20:20', nombre: 'Programación de Aplicaciones Móviles', sigla: 'PGY4121', seccion: '008V', sala: 'SJ-L7', profesorEmail: 'cmartinez@profesor.duoc.cl' },
    { dia: 'Lunes', horario: '20:30 - 21:50', nombre: 'Inglés Intermedio', sigla: 'INI5111', seccion: '018V', sala: 'SJ-604', profesorEmail: 'otroprofesor@profesor.duoc.cl' },
    { dia: 'Martes', horario: '17:30 - 18:50', nombre: 'Musculación y Pesas', sigla: 'MUSM', seccion: '001V', sala: 'Gimnasio Sede SJ', profesorEmail: 'otroprofesor@profesor.duoc.cl' },
    { dia: 'Martes', horario: '19:00 - 21:10', nombre: 'Programación de Aplicaciones Móviles', sigla: 'PGY4121', seccion: '008V', sala: 'SJ-L7', profesorEmail: 'carlos.martinez@profesor.duoc.cl' },
    { dia: 'Martes', horario: '21:10 - 22:30', nombre: 'Inglés Intermedio', sigla: 'INI5111', seccion: '018V', sala: 'SJ-604', profesorEmail: 'otroprofesor@profesor.duoc.cl' },
    { dia: 'Miércoles', horario: '19:00 - 20:20', nombre: 'Estadística Descriptiva', sigla: 'MAT4140', seccion: '010V', sala: 'SJ-L4', profesorEmail: 'otroprofesor@profesor.duoc.cl' },
    { dia: 'Miércoles', horario: '20:30 - 21:50', nombre: 'Inglés Intermedio', sigla: 'INI5111', seccion: '018V', sala: 'SJ-604', profesorEmail: 'otroprofesor@profesor.duoc.cl' },
    { dia: 'Jueves', horario: '17:30 - 18:50', nombre: 'Musculación y Pesas', sigla: 'MUSJ', seccion: '001V', sala: 'Gimnasio Sede SJ', profesorEmail: 'otroprofesor@profesor.duoc.cl' },
    { dia: 'Jueves', horario: '19:00 - 20:20', nombre: 'Programación de Aplicaciones Móviles', sigla: 'PGY4121', seccion: '008V', sala: 'SJ-L7', profesorEmail: 'carlos.martinez@profesor.duoc.cl' },
    { dia: 'Jueves', horario: '20:30 - 21:10', nombre: 'Calidad de Software', sigla: 'CSY4111', seccion: '008V', sala: 'SJ-L8', profesorEmail: 'otroprofesor@profesor.duoc.cl' },
    { dia: 'Jueves', horario: '21:10 - 22:30', nombre: 'Inglés Intermedio', sigla: 'INI5111', seccion: '018V', sala: 'SJ-604', profesorEmail: 'otroprofesor@profesor.duoc.cl' },
    { dia: 'Viernes', horario: '19:00 - 20:20', nombre: 'Estadística Descriptiva', sigla: 'MAT4140', seccion: '010V', sala: 'SJ-L4', profesorEmail: 'otroprofesor@profesor.duoc.cl' },
    { dia: 'Viernes', horario: '20:30 - 22:30', nombre: 'Calidad de Software', sigla: 'CSY4111', seccion: '008V', sala: 'SJ-L9', profesorEmail: 'otroprofesor@profesor.duoc.cl' },
    { dia: 'Sábado', horario: '13:00 - 14:20', nombre: 'Arquitectura', sigla: 'ASY4131', seccion: '008V', sala: 'SJ-L6', profesorEmail: 'otroprofesor@profesor.duoc.cl' }
  ];

  private anioAcademicoActual: number = new Date().getFullYear(); // Año académico actual
  private mesesValidos: number[] = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // Meses válidos (marzo a diciembre)

  constructor() {}

  getAsignaturasPorDia(dia: string): Asignatura[] {
    return this.asignaturas.filter(asignatura => asignatura.dia.toLowerCase() === dia.toLowerCase());
  }

  getAsignaturasPorDiaYAnio(dia: string, anio: number, mes: number): Asignatura[] {
    if (anio !== this.anioAcademicoActual || !this.mesesValidos.includes(mes)) {
      return []; // Retorna vacío si el año o mes no son válidos
    }
    return this.getAsignaturasPorDia(dia);
  }

  // Método para obtener asignaturas por correo de profesor
  getAsignaturasPorProfesor(email: string): Asignatura[] {
    return this.asignaturas.filter(asignatura => asignatura.profesorEmail === email);
  }

  getAsignaturaPorSigla(sigla: string): Asignatura | undefined {
    return this.asignaturas.find(asignatura => asignatura.sigla === sigla);
  }
  
}
