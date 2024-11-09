// src/app/profesor-asignaturas/profesor-asignaturas.page.ts
import { Component, OnInit } from '@angular/core';
import { AsignaturaService } from '../services/asignatura.service';
import { AuthService } from '../services/auth.service';
import { Asignatura } from '../models/asignatura.model';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profesor-asignaturas',
  templateUrl: './profesor-asignaturas.page.html',
  styleUrls: ['./profesor-asignaturas.page.scss'],
})
export class ProfesorAsignaturasPage implements OnInit {
  asignaturas: Asignatura[] = [];

  constructor(
    private asignaturaService: AsignaturaService,
    private authService: AuthService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    const userEmail = await this.authService.getCurrentUserEmail();
    if (userEmail) {
      this.asignaturas = this.asignaturaService.getAsignaturasPorProfesor(userEmail);
    }
  }

  async generarQR(asignatura: Asignatura) {
    const fechaHoy = new Date().toLocaleDateString();
    const qrData = `${asignatura.seccion} | 008D | ${asignatura.sala} | ${fechaHoy}`;

    const alert = await this.alertController.create({
      header: 'Código QR Generado',
      message: `Datos: ${qrData}`,
      buttons: ['OK']
    });

    await alert.present();
  }
}
