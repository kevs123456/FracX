import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AlertController } from '@ionic/angular';
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
  isLoading: boolean = false; // Para controlar el estado de carga

  constructor(
    private router: Router,
    private apiService: ApiService,
    private alertController: AlertController
  ) {}

  goToContact() {
    this.router.navigate(['/contact']);
  }

  login() {
    // Validación básica antes de enviar
    if (!this.usuario || !this.password) {
      this.mostrarAlerta('Campos vacíos', 'Por favor ingresa usuario y contraseña');
      return;
    }

    this.isLoading = true; // Activar indicador de carga

    this.apiService.login(this.usuario, this.password).subscribe({
      next: (response) => {
        this.isLoading = false; // Desactivar indicador de carga
        
        if (response.success) {
          localStorage.setItem('userId', response.id);
          localStorage.setItem('nombreUsuario', response.usuario);

          if (response.rol === 'admin') {
            this.router.navigate(['/admin']);
          } else if (response.rol === 'user') {
            this.router.navigate(['/usuario']);
          }
        } else {
          this.mostrarAlerta('Error de acceso', response.message || 'Credenciales incorrectas');
        }
      },
      error: (error) => {
        this.isLoading = false; // Asegurarse de desactivar el indicador de carga
        
        console.error('Error en login:', error); // Log para depuración
        
        if (error.status === 0) {
          this.mostrarAlerta('Error de conexión', 'No se pudo conectar al servidor. Verifica tu conexión a internet.');
        } else if (error.status === 401) {
          this.mostrarAlerta('Acceso denegado', 'Usuario y/o contraseña incorrectos');
        } else if (error.status === 500) {
          this.mostrarAlerta('Acceso denegado', 'Usuario y/o contraseña incorrectos');
        } else {
          this.mostrarAlerta('Error', 'Ocurrió un error inesperado. Por favor intenta nuevamente.');
        }
      }
    });
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
      cssClass: 'custom-alert' // Puedes añadir clases CSS personalizadas
    });
    
    await alert.present();
  }
}