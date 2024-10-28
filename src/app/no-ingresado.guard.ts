import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
 // Asegúrate de que la ruta es correcta
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NoIngresadoGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.getAuthState().pipe(
      map(user => {
        if (!user) {
          return true; // Permitir acceso
        } else {
          this.router.navigate(['/inicio']); // Redirigir a inicio si ya está autenticado
          return false; // Denegar acceso
        }
      })
    );
  }
}
