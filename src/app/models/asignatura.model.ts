// src/app/models/asignatura.model.ts
export interface Asignatura {
    dia: string;           // Día de la asignatura (por ejemplo, "Lunes")
    horario: string;       // Horario de la clase (por ejemplo, "19:00 - 20:20")
    nombre: string;        // Nombre de la asignatura (por ejemplo, "Ética para el Trabajo")
    seccion: string;       // Sección de la asignatura (por ejemplo, "EAY4470")
    sala: string;          // Sala donde se imparte la asignatura (por ejemplo, "SJ-706")
    profesorEmail?: string; // Añadir campo opcional profesor
}
