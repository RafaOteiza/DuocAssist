import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  register(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        if (user) {
          localStorage.setItem('userToken', user.uid);

          if (email.endsWith('@profesor.duoc.cl')) {
            this.router.navigate(['/profesor-asignaturas']);
          } else {
            this.router.navigate(['/inicio']);
          }
        }
      })
      .catch((error) => {
        console.error('Error al registrar:', error);
        throw error;
      });
  }

  login(email: string, password: string): Promise<void | string> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const uid = userCredential.user?.uid;
        if (uid) {
          localStorage.setItem('userToken', uid);

          if (email.endsWith('@profesor.duoc.cl')) {
            this.router.navigate(['/profesor-asignaturas']);
          } else {
            this.router.navigate(['/inicio']);
          }
        }
      })
      .catch((error) => {
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
        return Promise.reject(errorMessage);
      });
  }

  logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('datosPersonales');
    
    return this.afAuth.signOut()
      .then(() => {
        this.router.navigate(['/login']);
      });
  }

  getAuthState() {
    return this.afAuth.authState;
  }

  async getCurrentUserEmail(): Promise<string | null> {
    const user = await this.afAuth.currentUser;
    return user?.email || null;
  }
}
