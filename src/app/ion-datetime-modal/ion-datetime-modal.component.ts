// src/app/ion-datetime-modal/ion-datetime-modal.component.ts
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AsignaturaService } from '../services/asignatura.service';
import { Asignatura } from '../models/asignatura.model';

@Component({
  selector: 'app-ion-datetime-modal',
  templateUrl: './ion-datetime-modal.component.html',
  styleUrls: ['./ion-datetime-modal.component.scss'],
})
export class IonDatetimeModalComponent {
  fechaSeleccionada: string = '';
  asignaturasDelDia: Asignatura[] = [];

  constructor(
    private modalController: ModalController,
    private asignaturaService: AsignaturaService
  ) {}

  close() {
    this.modalController.dismiss();
  }

  onDateChange(event: any) {
    const diaSeleccionado = new Date(event.detail.value).toLocaleDateString('es-ES', { weekday: 'long' });
    this.asignaturasDelDia = this.asignaturaService.getAsignaturasPorDia(diaSeleccionado);
  }
}
