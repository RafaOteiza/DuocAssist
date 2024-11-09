import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  // Método para registrar al usuario
  register(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        if (user) {
          // Guardar el token de usuario en localStorage
          localStorage.setItem('userToken', user.uid);

<<<<<<< Updated upstream
          // Verificar si el usuario tiene datos personales guardados
          const datosPersonales = localStorage.getItem('datosPersonales');
          
          if (!datosPersonales) {
            // Si no hay datos personales, redirigir a la página de datos personales
            this.router.navigate(['/personal-data']);
          } else {
            // Si ya tiene datos personales, redirigir a la página de inicio
            this.router.navigate(['/inicio']);
=======
          // Redirigir al usuario según su dominio de correo electrónico
          if (email.endsWith('@profesor.duoc.cl')) {
            this.router.navigate(['/profesor-asignaturas']); // Vista para el profesor
          } else {
            this.router.navigate(['/inicio']); // Vista para el alumno
>>>>>>> Stashed changes
          }
        }
      })
      .catch((error) => {
        console.error('Error al registrar:', error); // Manejo de errores
        throw error;
      });
  }

  // Método para iniciar sesión
  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const uid = userCredential.user?.uid;
        if (uid) {
          // Guardar el token de usuario en localStorage
          localStorage.setItem('userToken', uid);

<<<<<<< Updated upstream
          // Verificar si el usuario tiene datos personales guardados
          const datosPersonales = localStorage.getItem('datosPersonales');
          
          if (!datosPersonales) {
            // Si no hay datos personales, redirigir a la página de datos personales
            this.router.navigate(['/personal-data']);
          } else {
            // Si ya tiene datos personales, redirigir a la página de inicio
            this.router.navigate(['/inicio']);
=======
          // Redirigir al usuario según su dominio de correo electrónico
          if (email.endsWith('@profesor.duoc.cl')) {
            this.router.navigate(['/profesor-asignaturas']); // Vista para el profesor
          } else {
            this.router.navigate(['/inicio']); // Vista para el alumno
>>>>>>> Stashed changes
          }
        }
      })
      .catch((error) => {
        console.error('Error al iniciar sesión:', error); // Manejo de errores
        throw error;
      });
  }

  // Método para cerrar sesión
  logout() {
    // Eliminar el token de usuario y los datos personales de localStorage
    localStorage.removeItem('userToken');
    localStorage.removeItem('datosPersonales');
    
    return this.afAuth.signOut()
      .then(() => {
        // Redirigir a la página de login
        this.router.navigate(['/login']);
      });
  }

  // Método para obtener el estado de autenticación del usuario
  getAuthState() {
    return this.afAuth.authState;
  }
<<<<<<< Updated upstream
=======

  // Método para obtener el correo del usuario actual
  async getCurrentUserEmail(): Promise<string | null> {
    const user = await this.afAuth.currentUser;
    return user?.email || null;
  }
>>>>>>> Stashed changes
}
