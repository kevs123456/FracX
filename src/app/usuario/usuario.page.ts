import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { AlertController } from '@ionic/angular'; // Para mostrar alertas

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class UsuarioPage implements OnInit {
  nombreUsuario: string = 'Cargando...';
  codigos: any[] = []; // Array para almacenar los códigos generados

  constructor(
    private apiService: ApiService,
    private router: Router,
    private alertController: AlertController
  ) {}
  logout() {
    localStorage.removeItem('userId'); // Eliminar el ID del usuario
    localStorage.removeItem('nombreUsuario'); // Eliminar el nombre del usuario
    this.router.navigate(['/login']); // Redirige al login
  }

  ngOnInit() {
    const userId = localStorage.getItem('userId'); // Obtener el ID del usuario

    if (userId) {
      // Obtener el nombre del usuario
      this.apiService.obtenerUsuario(userId).subscribe(
        (response) => {
          this.nombreUsuario = response.usuario;
        },
        (error) => {
          console.error('Error al obtener el usuario', error);
          this.nombreUsuario = 'Error al cargar nombre';
        }
      );

      // Obtener los códigos del usuario
      this.obtenerCodigos(userId);
    } else {
      this.nombreUsuario = 'Usuario no encontrado';
    }
  }

  // Método para generar un código aleatorio
  generarCodigo() {
    const userId = localStorage.getItem('userId'); // Obtener el ID del usuario
    const nombreUsuario = this.nombreUsuario; // Obtener el nombre del usuario

    if (!userId || !nombreUsuario) {
        this.mostrarAlerta('Error', 'Usuario no identificado');
        return;
    }

    // Generar un código aleatorio de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    // Enviar el código al backend para almacenarlo
    this.apiService.agregarCodigo(userId, codigo, nombreUsuario).subscribe(
        (response) => {
            if (response.success) {
                this.mostrarAlerta('Éxito', 'Código generado y guardado');
                this.obtenerCodigos(userId); // Actualizar la lista de códigos
            } else {
                this.mostrarAlerta('Error', response.message);
            }
        },
        (error) => {
            this.mostrarAlerta('Error', 'No se pudo conectar al servidor');
        }
    );
}

  // Método para obtener los códigos del usuario
  obtenerCodigos(userId: string) {
    this.apiService.obtenerCodigos(userId).subscribe(
      (response) => {
        this.codigos = response.codigos; // Asignar los códigos al array
      },
      (error) => {
        console.error('Error al obtener los códigos:', error);
      }
    );
  }
  
  eliminarCodigo(codigoId: string) {
    const userId = localStorage.getItem('userId'); // Obtener el ID del usuario
    if (!userId) {
      this.mostrarAlerta('Error', 'Usuario no identificado');
      return;
    }

    // Llamar a la API para eliminar el código
    this.apiService.eliminarCodigo(codigoId).subscribe(
      (response) => {
        if (response.success) {
          this.mostrarAlerta('Éxito', 'Código eliminado');
          this.obtenerCodigos(userId); // Actualizar la lista de códigos
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

  // Método para cerrar sesión
 
}