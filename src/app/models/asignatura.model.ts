export interface Asignatura {
    dia: string;           // Día de la asignatura (por ejemplo, "Lunes")
    horario: string;       // Horario de la clase (por ejemplo, "19:00 - 20:20")
    nombre: string;        // Nombre de la asignatura (por ejemplo, "Ética para el Trabajo")
    sigla: string;         // Sigla de la asignatura (por ejemplo, "PGY4121")
    seccion: string;       // Sección de la asignatura (por ejemplo, "008V")
    sala: string;          // Sala donde se imparte la asignatura (por ejemplo, "SJ-L706")
    profesorEmail?: string; // Campo opcional para el correo del profesor
  }
  