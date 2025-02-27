import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class UsuarioPage implements OnInit {
  nombreUsuario: string = 'Cargando...';

  constructor(private apiService: ApiService, private router: Router) {} // Inyectar ambos en un solo constructor
  logout() {
    this.router.navigate(['/login']); // Redirige al login
  }

  ngOnInit() {
    const userId = localStorage.getItem('userId'); // Obtener el ID del usuario

    if (userId) {
      this.apiService.obtenerUsuario(userId).subscribe(
        (response) => {
          this.nombreUsuario = response.usuario; // Suponiendo que la API devuelve { usuario: "Kevin Aparicio" }
        },
        (error) => {
          console.error('Error al obtener el usuario', error);
          this.nombreUsuario = 'Error al cargar nombre';
        }
      );
    } else {
      this.nombreUsuario = 'Usuario no encontrado';
    }
  }
}