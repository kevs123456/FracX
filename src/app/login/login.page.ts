import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service'; // Importa el servicio
import { AlertController } from '@ionic/angular'; // Para mostrar alertas
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class LoginPage {
  usuario: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private apiService: ApiService, // Inyecta el servicio
    private alertController: AlertController // Inyecta el controlador de alertas
  ) {}

  goToContact() {
    this.router.navigate(['/contact']);
  }

  // Método para hacer login
  login() {
    this.apiService.login(this.usuario, this.password).subscribe({
      next: (response) => {
        if (response.success) {
          localStorage.setItem('userId', response.id);
          localStorage.setItem('nombreUsuario', response.usuario);
  
          if (response.rol === 'admin') {
            this.router.navigate(['/admin']);
          } else if (response.rol === 'user') {
            this.router.navigate(['/usuario']);
          }
        } else {
          // Mensaje específico del backend para credenciales incorrectas
          this.mostrarAlerta('Error de acceso', response.message || 'Credenciales incorrectas');
        }
      },
      error: (error) => {
        // Manejo diferenciado de errores HTTP
        if (error.status === 0 || error.status === 500) {
          this.mostrarAlerta('Error de servidor', 'No se pudo conectar al servidor. Intente más tarde.');
        } else if (error.status === 401) {
          this.mostrarAlerta('Acceso denegado', 'Usuario o contraseña incorrectos');
        } else {
          this.mostrarAlerta('Error', error.message || 'Ocurrió un error inesperado');
        }
      }
    });
  }
  

  // Método para mostrar alertas
  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }
}