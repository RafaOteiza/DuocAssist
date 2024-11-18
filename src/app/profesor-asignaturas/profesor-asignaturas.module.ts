import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfesorAsignaturasPageRoutingModule } from './profesor-asignaturas-routing.module';

import { ProfesorAsignaturasPage } from './profesor-asignaturas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfesorAsignaturasPageRoutingModule
  ],
  declarations: [ProfesorAsignaturasPage]
})
export class ProfesorAsignaturasPageModule {}
