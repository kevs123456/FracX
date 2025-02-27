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

  // Método para hacer login
  login() {
    this.apiService.login(this.usuario, this.password).subscribe(
      (response) => {
        if (response.success) {
          localStorage.setItem('userId', response.id); // Guardar ID
          localStorage.setItem('nombreUsuario', response.usuario); // Guardar nombre
  
          // Redirige según el rol del usuario
          if (response.rol === 'admin') {
            this.router.navigate(['/admin']);
          } else if (response.rol === 'user') {
            this.router.navigate(['/usuario']);
          }
        } else {
          this.mostrarAlerta('Error', response.message);
        }
      },
      (error) => {
        this.mostrarAlerta('Error', 'No se pudo conectar al servidor');
      }
    );
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