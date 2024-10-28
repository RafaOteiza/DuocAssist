import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importamos el Router para la redirección

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
})
export class AjustesPage implements OnInit {

  paletteToggle = false;

  constructor(private router: Router) {} // Añadimos Router en el constructor

  ngOnInit() {
    // Leer el estado guardado del modo oscuro desde el localStorage
    const storedThemePreference = localStorage.getItem('darkMode');
    if (storedThemePreference) {
      this.paletteToggle = JSON.parse(storedThemePreference);
      this.toggleDarkMode(this.paletteToggle);
    }
  }

  // Manejar el cambio desde el botón y guardar el estado en localStorage
  toggleChange(ev: any) {
    this.paletteToggle = ev.detail.checked;
    localStorage.setItem('darkMode', JSON.stringify(this.paletteToggle)); // Guardar en localStorage
    this.toggleDarkMode(this.paletteToggle);
  }

  // Agregar o eliminar la clase "dark" en el elemento body
  toggleDarkMode(shouldAdd: boolean) {
    if (shouldAdd) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  // Función para redirigir a la página de Datos Personales
  irADatosPersonales() {
    this.router.navigate(['/personal-data']); // Redirigir a la vista de datos personales
  }
}
