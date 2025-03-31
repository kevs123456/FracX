import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ToastController, AlertController } from '@ionic/angular'; // Añade AlertController

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
  usuariosDisponibles: any[] = [];
  estadoPorton: string = 'Estado del porton: Cerrado';
  editandoUsuario: any = null;
  nuevaTarjeta: string = '';
  registrosEntrada: any[] = [];
  registrosSalida: any[] = [];

  constructor(
    private apiService: ApiService, 
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController // Añade esto

  ) {}

  // Función para mostrar toasts
  async mostrarToast(mensaje: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'top',
      color: color
    });
    await toast.present();
  }

  logout() {
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.cargarUsuarios();
    this.cargarRegistros(); 
  }

  cargarUsuarios() {
    this.apiService.listarUsuarios().subscribe(
      (response) => {
        this.usuarios = response.filter((usuario: any) => usuario.rol !== 'admin');
        this.usuariosDisponibles = this.usuarios;
      },
      (error) => {
        this.mostrarToast('Error al cargar usuarios', 'danger');
      }
    );
  }

  crearUsuario() {
    this.apiService.crearUsuario(this.nuevoUsuario, this.nuevaPassword).subscribe(
      (response) => {
        this.mostrarToast('Usuario creado exitosamente');
        this.cargarUsuarios();
        this.nuevoUsuario = '';
        this.nuevaPassword = '';
      },
      (error) => {
        this.mostrarToast('Error al crear usuario', 'danger');
      }
    );
  }

  editarUsuario(usuario: any) {
    this.editandoUsuario = { ...usuario };
  }

  guardarEdicion() {
    this.apiService.editarUsuario(this.editandoUsuario._id, this.editandoUsuario.usuario, this.editandoUsuario.password).subscribe(
      (response) => {
        this.mostrarToast('Usuario editado exitosamente');
        this.cargarUsuarios();
        this.editandoUsuario = null;
      },
      (error) => {
        this.mostrarToast('Error al editar usuario', 'danger');
      }
    );
  }

  async eliminarUsuario(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este usuario y todos sus métodos de acceso asociados?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          cssClass: 'danger',
          handler: () => {
            this.confirmarEliminacion(id);
          }
        }
      ]
    });
  
    await alert.present();
  }
  
  private confirmarEliminacion(id: string) {
    const usuario = this.usuarios.find(u => u._id === id);
    if (usuario) {
      this.apiService.eliminarPlacasPorUsuario(usuario.usuario).subscribe(
        () => {
          this.apiService.eliminarUsuario(id).subscribe(
            () => {
              this.mostrarToast('Usuario y métodos eliminados correctamente');
              this.cargarUsuarios();
            },
            (error) => {
              this.mostrarToast('Error al eliminar usuario', 'danger');
            }
          );
        },
        (error) => {
          this.mostrarToast('Error al eliminar las placas asociadas', 'danger');
        }
      );
    }
  }

  abrirPorton() {
    this.estadoPorton = 'abriendo...';
    this.mostrarToast('Portón abriendo...', 'warning');
    this.apiService.modificarEstado('abierto').subscribe(
      () => {
        this.estadoPorton = 'abierto';
        this.mostrarToast('Portón abierto');
        setTimeout(() => {
          this.cerrarPorton();
        }, 20000);
      },
      (error) => {
        this.mostrarToast('Error al abrir el portón', 'danger');
        this.estadoPorton = 'cerrado';
      }
    );
  }

  cerrarPorton() {
    this.estadoPorton = 'cerrando...';
    this.mostrarToast('Portón cerrando...', 'warning');
    this.apiService.modificarEstado('cerrado').subscribe(
      () => {
        this.estadoPorton = 'cerrado';
        this.mostrarToast('Portón cerrado');
      },
      (error) => {
        this.mostrarToast('Error al cerrar el portón', 'danger');
        this.estadoPorton = 'abierto';
      }
    );
  }

  registrarTarjeta() {
    if (!this.nuevaTarjeta || !this.usuarioPropietario) {
      this.mostrarToast('Complete todos los campos', 'warning');
      return;
    }
  
    this.apiService.registrarTarjeta(this.nuevaTarjeta, this.usuarioPropietario).subscribe(
      (response) => {
        this.mostrarToast('Tarjeta registrada exitosamente');
        this.nuevaTarjeta = '';
        this.usuarioPropietario = '';
      },
      (error) => {
        this.mostrarToast('Error al registrar la tarjeta', 'danger');
      }
    );
  }

  registrarPlaca() {
    if (!this.nuevaPlaca || !this.usuarioPropietario) {
      this.mostrarToast('Complete todos los campos', 'warning');
      return;
    }

    this.apiService.registrarPlaca(this.nuevaPlaca, this.usuarioPropietario).subscribe(
      (response) => {
        this.mostrarToast('Placa registrada exitosamente');
        this.nuevaPlaca = '';
        this.usuarioPropietario = '';
      },
      (error) => {
        this.mostrarToast('Error al registrar la placa', 'danger');
      }
    );
  }

  cargarRegistros() {
    this.apiService.obtenerRegistrosEntrada().subscribe(
      (response) => {
        const registros = Array.isArray(response) ? response : response.data;
        registros.sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        this.registrosEntrada = registros.slice(0, 5);
      },
      (error) => {
        this.mostrarToast('Error al cargar registros de entrada', 'danger');
      }
    );
  
    this.apiService.obtenerRegistrosSalida().subscribe(
      (response) => {
        const registros = Array.isArray(response.data) ? response.data : [];
        registros.sort((a: any, b: any) => new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime());
        this.registrosSalida = registros.slice(0, 5).map((registro: any) => {
          return {
            hora: this.extraerHora(registro.fecha_hora)
          };
        });
      },
      (error) => {
        this.mostrarToast('Error al cargar registros de salida', 'danger');
      }
    );
  }
  
  extraerHora(fechaHora: string): string {
    const fecha = new Date(fechaHora);
    return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}