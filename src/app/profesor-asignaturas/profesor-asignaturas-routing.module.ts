import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfesorAsignaturasPage } from './profesor-asignaturas.page';

const routes: Routes = [
  {
    path: '',
    component: ProfesorAsignaturasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfesorAsignaturasPageRoutingModule {}
