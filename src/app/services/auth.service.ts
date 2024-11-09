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

          // Redirigir al usuario según su dominio de correo electrónico
          if (email.endsWith('@profesor.duoc.cl')) {
            this.router.navigate(['/profesor-asignaturas']); // Vista para el profesor
          } else {
            this.router.navigate(['/inicio']); // Vista para el alumno
          }
        }
      })
      .catch((error) => {
        console.error('Error al registrar:', error);
        throw error;
      });
  }

  // Método para iniciar sesión con manejo de errores personalizado
  login(email: string, password: string): Promise<void | string> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const uid = userCredential.user?.uid;
        if (uid) {
          // Guardar el token de usuario en localStorage
          localStorage.setItem('userToken', uid);

          // Redirigir al usuario según su dominio de correo electrónico
          if (email.endsWith('@profesor.duoc.cl')) {
            this.router.navigate(['/profesor-asignaturas']); // Vista para el profesor
          } else {
            this.router.navigate(['/inicio']); // Vista para el alumno
          }
        }
      })
      .catch((error) => {
        // Personalización de mensajes de error
        let errorMessage = '';

        switch (error.code) {
          case 'auth/invalid-credential':
            errorMessage = 'Las credenciales ingresadas son inválidas. Por favor, verifica tu correo y contraseña.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'No se encontró una cuenta con este correo. Regístrate si aún no tienes una cuenta.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'La contraseña es incorrecta. Inténtalo de nuevo.';
            break;
          default:
            errorMessage = 'Ocurrió un error al iniciar sesión. Inténtalo más tarde.';
        }

        console.error('Error al iniciar sesión:', errorMessage);
        return Promise.reject(errorMessage); // Retorna el mensaje de error personalizado
      });
  }

  // Método para cerrar sesión
  logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('datosPersonales');
    
    return this.afAuth.signOut()
      .then(() => {
        this.router.navigate(['/login']);
      });
  }

  // Método para obtener el estado de autenticación del usuario
  getAuthState() {
    return this.afAuth.authState;
  }
}

