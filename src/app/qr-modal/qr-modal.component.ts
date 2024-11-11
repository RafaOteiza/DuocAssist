import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-qr-modal',
  templateUrl: './qr-modal.component.html',
  styleUrls: ['./qr-modal.component.scss'],
})
export class QrModalComponent implements OnInit {
  @Input() qrUrl?: string;

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    console.log("Modal QR URL:", this.qrUrl);
  }

  close() {
    this.modalController.dismiss();
  }
}
