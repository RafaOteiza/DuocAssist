import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // Importa FormsModule

// Importaciones de Firebase y AngularFire
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';  // Asegúrate de que este archivo tenga la configuración de Firebase

// Importa tu servicio de autenticación
import { AuthService } from './services/auth.service';

// Importa HttpClientModule
import { HttpClientModule } from '@angular/common/http';

// Importa el componente IonDatetimeModalComponent
import { IonDatetimeModalComponent } from './ion-datetime-modal/ion-datetime-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    IonDatetimeModalComponent  // Agrega el componente modal aquí
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,  // Añadir FormsModule para ngModel
    HttpClientModule, // Añadir HttpClientModule aquí
    // Inicialización de Firebase
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
  ],
  providers: [
    AuthService,  // Añadir AuthService a los providers
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Agregar CUSTOM_ELEMENTS_SCHEMA aquí
})
export class AppModule {}
