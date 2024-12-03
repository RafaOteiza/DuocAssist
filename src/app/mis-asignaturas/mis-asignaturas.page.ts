import { Component, OnInit } from '@angular/core';
import { AsignaturaService } from '../services/asignatura.service';
import { Asignatura } from '../models/asignatura.model';


@Component({
  selector: 'app-mis-asignaturas',
  templateUrl: './mis-asignaturas.page.html',
  styleUrls: ['./mis-asignaturas.page.scss'],
})
export class MisAsignaturasPage implements OnInit {
  asignaturasPorDia: { [key: string]: Asignatura[] } = {};
  diasOrdenados: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  anioActual: number = new Date().getFullYear(); // Año académico actual
  mesActual: number = new Date().getMonth() + 1; // Mes actual

  constructor(private asignaturaService: AsignaturaService) {}

  ngOnInit() {
    this.organizarAsignaturasPorDia();
  }

  organizarAsignaturasPorDia() {
    this.diasOrdenados.forEach(dia => {
      this.asignaturasPorDia[dia] = this.asignaturaService.getAsignaturasPorDiaYAnio(
        dia,
        this.anioActual,
        this.mesActual
      );
    });
  }
}
