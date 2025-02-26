import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule], // Agrega los módulos necesarios
})
export class AdminPage implements OnInit {
  nuevoUsuario: string = '';
  nuevaPassword: string = '';
  usuarios: any[] = [];
  estadoPorton: string = 'Estado del porton desconocido';
  editandoUsuario: any = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  // Cargar la lista de usuarios
  cargarUsuarios() {
    this.apiService.listarUsuarios().subscribe(
      (response) => {
        // Filtra los usuarios para excluir al admin
        this.usuarios = response.filter((usuario: any) => usuario.rol !== 'admin');
      },
      (error) => {
        console.error('Error al cargar usuarios', error);
      }
    );
  }

  // Añadir un nuevo usuario
  crearUsuario() {
    this.apiService.crearUsuario(this.nuevoUsuario, this.nuevaPassword).subscribe(
      (response) => {
        alert('Usuario creado exitosamente');
        this.cargarUsuarios(); // Recargar la lista de usuarios
        this.nuevoUsuario = '';
        this.nuevaPassword = '';
      },
      (error) => {
        alert('Error al crear usuario');
      }
    );
  }

  // Editar un usuario
  editarUsuario(usuario: any) {
    this.editandoUsuario = { ...usuario };
  }

  // Guardar cambios al editar un usuario
  guardarEdicion() {
    this.apiService.editarUsuario(this.editandoUsuario._id, this.editandoUsuario.usuario, this.editandoUsuario.password).subscribe(
      (response) => {
        alert('Usuario editado exitosamente');
        this.cargarUsuarios(); // Recargar la lista de usuarios
        this.editandoUsuario = null;
      },
      (error) => {
        alert('Error al editar usuario');
      }
    );
  }

  // Eliminar un usuario
  eliminarUsuario(id: string) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.apiService.eliminarUsuario(id).subscribe(
        (response) => {
          alert('Usuario eliminado exitosamente');
          this.cargarUsuarios(); // Recargar la lista de usuarios
        },
        (error) => {
          alert('Error al eliminar usuario');
        }
      );
    }
  }

  // Modificar el estado del portón
  modificarEstado(estado: string) {
    this.apiService.modificarEstado(estado).subscribe(
      (response) => {
        this.estadoPorton = `Estado: ${estado}`;
      },
      (error) => {
        alert('Error al modificar el estado');
      }
    );
  }
}