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
  anioAcademicoActual: number = new Date().getFullYear(); // Año académico actual
  mesesValidos: number[] = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // Meses válidos (marzo a diciembre)

  constructor(
    private modalController: ModalController,
    private asignaturaService: AsignaturaService
  ) {}

  close() {
    this.modalController.dismiss();
  }

  onDateChange(event: any) {
    const fecha = new Date(event.detail.value);
    const diaSeleccionado = fecha.toLocaleDateString('es-ES', { weekday: 'long' });
    const anioSeleccionado = fecha.getFullYear();
    const mesSeleccionado = fecha.getMonth() + 1;

    // Validar que el año y mes seleccionados sean válidos
    if (anioSeleccionado === this.anioAcademicoActual && this.mesesValidos.includes(mesSeleccionado)) {
      this.asignaturasDelDia = this.asignaturaService.getAsignaturasPorDia(diaSeleccionado);
    } else {
      this.asignaturasDelDia = []; // Si no es válido, no se muestran asignaturas
    }
  }
}
