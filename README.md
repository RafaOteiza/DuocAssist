# DuocAssist

**DuocAssist** es una aplicación móvil desarrollada con **Ionic Framework** y **Firebase** para la gestión académica de estudiantes y profesores. Incluye funcionalidades como login diferenciado por roles, registro de asistencia mediante códigos QR, notificaciones y un diseño intuitivo para mejorar la experiencia del usuario.

---

## Tabla de Contenidos

- [Características](#características)
- [Requisitos](#requisitos)
- [Configuración Inicial](#configuración-inicial)
- [Ejecución del Proyecto](#ejecución-del-proyecto)
- [Cambios Recientes](#cambios-recientes)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Autores](#autores)

---

## Características

### **Inicio de Sesión**
- Validación de dominios:
  - `@duocuc.cl` para alumnos.
  - `@profesor.duoc.cl` para profesores.
- Sistema de "Recordar Usuario".
- Restricción de registro para profesores.

### **Escaneo de QR**
- Registro de asistencia mediante códigos QR generados por los profesores.
- Escaneo con área de visualización personalizada.

### **Gestión de Usuario**
- Cambio de contraseña desde ajustes.
- Sección "Acerca de" con información del proyecto y sus autores.
- Soporte para enviar mensajes desde ajustes.

### **Notificaciones**
- Notificación de próxima clase según el horario.
- Alerta de registro exitoso de asistencia.

### **Diseño Intuitivo**
- Tema oscuro activable desde ajustes.
- Diseño responsivo para una experiencia óptima en dispositivos móviles.

---

## Requisitos

| Requisito          | Versión / Instrucción                                      |
|--------------------|-----------------------------------------------------------|
| **Node.js**        | Versión >= 14.x                                           |
| **Ionic CLI**      | Instalar con: `npm install -g @ionic/cli`                 |
| **Firebase CLI**   | Instalar con: `npm install -g firebase-tools`             |
| **Capacitor**      | Incluido con Ionic.                                       |
| **Android Studio** | Para compilar la aplicación en dispositivos Android.      |

---

## Configuración Inicial

### **Clonar el repositorio**
```bash
git clone https://github.com/RafaOteiza/DuocAssistV2.git
cd DuocAssistV2

