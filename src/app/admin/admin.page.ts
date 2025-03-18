import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class AdminPage implements OnInit {
  nuevoUsuario: string = '';
  nuevaPassword: string = '';
  nuevaPlaca: string = '';
  usuarioPropietario: string = '';
  usuarios: any[] = [];
  usuariosDisponibles: any[] = []; // Lista de usuarios disponibles (sin admin)
  estadoPorton: string = 'Estado del porton: Cerrado';
  editandoUsuario: any = null;
  nuevaTarjeta: string = ''; // Nueva propiedad para la tarjeta NFC
  registrosEntrada: any[] = []; // Arreglo para registros de entrada
  registrosSalida: any[] = [];  // Arreglo para registros de salida



  constructor(private apiService: ApiService, private router: Router) {}

  logout() {
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.apiService.listarUsuarios().subscribe(
      (response) => {
        // Filtra los usuarios para excluir al admin
        this.usuarios = response.filter((usuario: any) => usuario.rol !== 'admin');
        this.usuariosDisponibles = this.usuarios; // Asigna la lista filtrada a usuariosDisponibles
      },
      (error) => {
        console.error('Error al cargar usuarios', error);
      }
    );
  }

  crearUsuario() {
    this.apiService.crearUsuario(this.nuevoUsuario, this.nuevaPassword).subscribe(
      (response) => {
        alert('Usuario creado exitosamente');
        this.cargarUsuarios();
        this.nuevoUsuario = '';
        this.nuevaPassword = '';
      },
      (error) => {
        alert('Error al crear usuario');
      }
    );
  }

  editarUsuario(usuario: any) {
    this.editandoUsuario = { ...usuario };
  }

  guardarEdicion() {
    this.apiService.editarUsuario(this.editandoUsuario._id, this.editandoUsuario.usuario, this.editandoUsuario.password).subscribe(
      (response) => {
        alert('Usuario editado exitosamente');
        this.cargarUsuarios();
        this.editandoUsuario = null;
      },
      (error) => {
        alert('Error al editar usuario');
      }
    );
  }

  eliminarUsuario(id: string) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      // Obtener el usuario para eliminar sus placas
      const usuario = this.usuarios.find(u => u._id === id);
      if (usuario) {
        this.apiService.eliminarPlacasPorUsuario(usuario.usuario).subscribe(
          () => {
            // Una vez que las placas se han eliminado, eliminar el usuario
            this.apiService.eliminarUsuario(id).subscribe(
              () => {
                alert('Usuario y metodos de acceso eliminados');
                this.cargarUsuarios();
              },
              (error) => {
                console.error('Error al eliminar usuario', error);
                alert('Error al eliminar usuario');
              }
            );
          },
          (error) => {
            console.error('Error al eliminar placas', error);
            alert('Error al eliminar las placas del usuario');
          }
        );
      }
    }
  }

  abrirPorton() {
    this.estadoPorton = 'abriendo...';
    this.apiService.modificarEstado('abierto').subscribe(
      () => {
        this.estadoPorton = 'abierto';
        setTimeout(() => {
          this.cerrarPorton();
        }, 20000);
      },
      (error) => {
        alert('Error al abrir el portón');
        this.estadoPorton = 'cerrado';
      }
    );
  }

  cerrarPorton() {
    this.estadoPorton = 'cerrando...';
    this.apiService.modificarEstado('cerrado').subscribe(
      () => {
        this.estadoPorton = 'cerrado';
      },
      (error) => {
        alert('Error al cerrar el portón');
        this.estadoPorton = 'abierto';
      }
    );
  }

  registrarTarjeta() {
    if (!this.nuevaTarjeta || !this.usuarioPropietario) {
      alert('Por favor, complete todos los campos');
      return;
    }
  
    this.apiService.registrarTarjeta(this.nuevaTarjeta, this.usuarioPropietario).subscribe(
      (response) => {
        alert('Tarjeta registrada exitosamente');
        this.nuevaTarjeta = '';
        this.usuarioPropietario = '';
      },
      (error) => {
        alert('Error al registrar la tarjeta');
      }
    );
  }
  

  registrarPlaca() {
    if (!this.nuevaPlaca || !this.usuarioPropietario) {
      alert('Por favor, complete todos los campos');
      return;
    }

    this.apiService.registrarPlaca(this.nuevaPlaca, this.usuarioPropietario).subscribe(
      (response) => {
        alert('Placa registrada exitosamente');
        this.nuevaPlaca = '';
        this.usuarioPropietario = '';
      },
      (error) => {
        alert('Error al registrar la placa');
      }
    );
  }

  cargarRegistros() {
    this.apiService.obtenerRegistrosEntrada().subscribe(
      (response) => {
        this.registrosEntrada = response;
      },
      (error) => {
        console.error('Error al cargar registros de entrada', error);
      }
    );

    this.apiService.obtenerRegistrosSalida().subscribe(
      (response) => {
        this.registrosSalida = response;
      },
      (error) => {
        console.error('Error al cargar registros de salida', error);
      }
    );
  }
}