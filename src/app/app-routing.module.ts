import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NoIngresadoGuard } from './no-ingresado.guard';
import { IngresadoGuard } from './ingresado.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
    canActivate: [NoIngresadoGuard]
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then(m => m.RegistroPageModule),
    canActivate: [NoIngresadoGuard]
  },
  {
    path: 'inicio',
    loadChildren: () => import('./inicio/inicio.module').then(m => m.InicioPageModule),
    canActivate: [IngresadoGuard]
  },
  // Eliminar o comentar estas rutas si los módulos no existen:
  /*
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then(m => m.WelcomePageModule),
    canActivate: [NoIngresadoGuard]
  },
  {
    path: 'mis-asistencias',
    loadChildren: () => import('./mis-asistencias/mis-asistencias.module').then(m => m.MisAsistenciasPageModule),
    canActivate: [IngresadoGuard]
  },
  */
  {
    path: 'ajustes',
    loadChildren: () => import('./ajustes/ajustes.module').then(m => m.AjustesPageModule),
    canActivate: [IngresadoGuard]
  },
  {
    path: 'not-found',
    loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundPageModule)
  },
  {
    path: 'recuperar-contrasena',
    loadChildren: () => import('./recuperar-contrasena/recuperar-contrasena.module').then(m => m.RecuperarContrasenaPageModule)
  },
  {
    path: 'personal-data',
    loadChildren: () => import('./personal-data/personal-data.module').then(m => m.PersonalDataPageModule)
  },
  {
    path: 'mis-asignaturas',
    loadChildren: () => import('./mis-asignaturas/mis-asignaturas.module').then(m => m.MisAsignaturasPageModule),
    canActivate: [IngresadoGuard]
  },
  {
    path: 'profesor-asignaturas',
    loadChildren: () => import('./profesor-asignaturas/profesor-asignaturas.module').then(m => m.ProfesorAsignaturasPageModule),
    canActivate: [IngresadoGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

