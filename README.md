1. Descripción General
DuocAssist es una aplicación móvil diseñada para facilitar la gestión de asistencias en un entorno académico, permitiendo que los alumnos puedan registrar sus asistencias mediante códigos QR generados por los profesores. La aplicación también incluye un módulo para gestionar datos personales, un sistema de autenticación por roles (profesor y alumno).

2. Funcionalidades Implementadas
Sistema de Registro y Login:
•	Estudiantes: Solo pueden registrarse con correos que terminan en @duocuc.cl.
•	Profesores: Previamente creados, solo pueden iniciar sesión con correos @profesor.duoc.cl.
Gestión de Asistencias:
•	Escaneo de códigos QR generados por los profesores.
•	Registro de asistencias en Firebase Firestore.
•	Evita registros duplicados dentro del mismo día, da un tiempo de 40 minutos que corresponde a un módulo para volver registrar la misma asistencia.
Generación de Códigos QR (Profesores):
•	Los profesores pueden generar códigos QR asociados a sus asignaturas.
•	Los QR incluyen información de la asignatura, sección, y fecha.
Datos Personales:
•	Permite a los usuarios completar sus datos personales, incluyendo carrera, sexo, y teléfono.
Calendario
•	Se configuró el calendario para que muestre únicamente el año académico actual. Esto evita confusiones al seleccionar fechas fuera del período válido.
Cargando y Tiempos de Espera
•	Escaneo de QR: Se implementó un controlador de carga (loadingController) con un tiempo de espera máximo de 15 segundos. Esto mejora la experiencia del usuario, mostrando un indicador mientras se procesa el escaneo.
•	Generación de QR (Profesores): También se agregó un indicador de carga para cuando los profesores generan un código QR para sus asignaturas.
Modo Oscuro
•	La aplicación soporta modo oscuro, adaptándose automáticamente según la configuración del sistema del dispositivo. Esto mejora la accesibilidad y la experiencia del usuario en condiciones de poca luz.
Validaciones Generales
•	Cerrar sesión: Se asegura que los datos del usuario se eliminen de manera adecuada al salir.
•	Todas las acciones clave están protegidas con validaciones correspondientes

3. Configuración de Firebase
Asistencias
Contiene los registros de asistencia de los alumnos.
Campos:
•	alumnoID: string
•	nombreAsignatura: string
•	sigla: string
•	seccion: string
•	sala: string
•	fechaEscaneo: timestamp

Reglas de Seguridad en Firebase
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    match /asistencias/{asistenciaId} {
      allow read: if request.auth.uid != null;
      allow write: if request.auth.uid != null;
    }
  }
}



4. Implementación de la Aplicación
Dependencias Instaladas
•	AngularFire
•	Capacitor
•	Arquitectura de la Aplicación
•	AuthService: Maneja la autenticación, registro, login y logout.
•	AsistenciaService: Controla el registro y recuperación de asistencias.
•	personal-data.page: Página para gestionar los datos personales.
•	profesor-asignaturas.page: Página donde los profesores pueden generar códigos QR.
•	Firebase Firestore: Base de datos en la nube para almacenar las asistencias.
5. Paso a Paso para Usar la Aplicación
1. Registro de Usuario (Estudiantes)
•	Ingrese un correo que termine en @duocuc.cl.
•	Cree una contraseña y complete los datos requeridos.
2. Inicio de Sesión
•	Estudiantes: Use su correo @duocuc.cl para ingresar.
•	Profesores: Solo el profesor pre-registrado (carlos.martinez@profesor.duoc.cl) puede iniciar sesión.
3. Escaneo de Código QR
•	Diríjase al botón de escaneo QR en la página de inicio.
•	Escanee el código QR proporcionado por el profesor.
•	Si el código ya fue registrado, recibirá una alerta.
4. Generación de Códigos QR (Profesores)
•	Inicie sesión como profesor.
•	Acceda a la lista de asignaturas.
•	Genere un código QR para cada asignatura. Este incluirá la sigla, sección, sala y fecha actual.
5. Flujo de Trabajo para el Profesor
•	Inicie sesión con el correo del profesor registrado.
•	Genere un código QR para una asignatura específica.
•	Proporcione el QR a los alumnos para registrar su asistencia.
6. Flujo de Trabajo para el Alumno
•	Regístrese con un correo @duocuc.cl.
•	Escanee el QR generado por el profesor para registrar su asistencia.
•	Consulte sus registros de asistencia en la sección "Mis Asistencias".
7. Detalles Técnicos
•	Autenticación
•	Uso de AngularFireAuth para manejar la autenticación con Firebase.
•	El ID del documento es el UID del usuario autenticado.
•	Prevención de Asistencias Duplicadas
•	Antes de registrar una nueva asistencia, se verifica en Firestore si ya existe un registro para la misma asignatura, sección y fecha.
Generación de QR
Se utiliza la API de QR Server:
•	https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={data}
8. Roles Actuales
Alumno:
•	Registro e inicio de sesión con correo @duocuc.cl.
•	Escaneo de códigos QR para registrar asistencia.
•	Consulta de asistencias registradas.
Profesor:
•	Inicio de sesión con correo pre-registrado @profesor.duoc.cl.
•	Generación de códigos QR para asignaturas.
