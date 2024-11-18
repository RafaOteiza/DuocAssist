// src/app/profesor-asignaturas/profesor-asignaturas.page.ts

import { Component, OnInit } from '@angular/core';
import { AsignaturaService } from '../services/asignatura.service';
import { AuthService } from '../services/auth.service';
import { Asignatura } from '../models/asignatura.model';
import { AlertController, NavController, ModalController } from '@ionic/angular';
import { QrModalComponent } from '../qr-modal/qr-modal.component';

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
    private alertController: AlertController,
    private navCtrl: NavController,
    private modalController: ModalController
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
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
  
    // Verifica la URL generada
    console.log("QR URL:", qrApiUrl);
  
    // Abre el modal con el QR
    this.openQrModal(qrApiUrl);
  }

  async openQrModal(qrUrl: string) {
    const modal = await this.modalController.create({
      component: QrModalComponent,
      componentProps: { qrUrl: qrUrl }
    });
    await modal.present();
  }

  async cerrarSesion() {
    await this.authService.logout();
    this.navCtrl.navigateRoot('/login');
  }
}
