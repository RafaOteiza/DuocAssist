import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginPage } from './login/login.page';
import { NoIngresadoGuard } from './no-ingresado.guard';
import { AlumnoGuard } from './guards/alumno.guard';
import { ProfesorGuard } from './guards/profesor.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginPage,
    canActivate: [NoIngresadoGuard],
  },
  {
    path: 'registro',
    loadChildren: () =>
      import('./registro/registro.module').then((m) => m.RegistroPageModule),
  },
  {
    path: 'recuperar-contrasena',
    loadChildren: () =>
      import('./recuperar-contrasena/recuperar-contrasena.module').then(
        (m) => m.RecuperarContrasenaPageModule
      ),
  },
  {
    path: 'profesor-asignaturas',
    loadChildren: () =>
      import('./profesor-asignaturas/profesor-asignaturas.module').then(
        (m) => m.ProfesorAsignaturasPageModule
      ),
    canActivate: [ProfesorGuard],
  },
  {
    path: 'personal-data',
    loadChildren: () =>
      import('./personal-data/personal-data.module').then(
        (m) => m.PersonalDataPageModule
      ),
  },
  {
    path: 'not-found',
    loadChildren: () =>
      import('./not-found/not-found.module').then((m) => m.NotFoundPageModule),
  },
  {
    path: 'mis-asignaturas',
    loadChildren: () =>
      import('./mis-asignaturas/mis-asignaturas.module').then(
        (m) => m.MisAsignaturasPageModule
      ),
    canActivate: [AlumnoGuard],
  },
  {
    path: 'inicio',
    loadChildren: () =>
      import('./inicio/inicio.module').then((m) => m.InicioPageModule),
    canActivate: [AlumnoGuard],
  },
  {
    path: 'ajustes',
    loadChildren: () =>
      import('./ajustes/ajustes.module').then((m) => m.AjustesPageModule),
    canActivate: [AlumnoGuard],
  },
  {
    path: 'asistencias',
    loadChildren: () =>
      import('./asistencias/asistencias.module').then(
        (m) => m.AsistenciasPageModule
      ),
    canActivate: [AlumnoGuard],
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
