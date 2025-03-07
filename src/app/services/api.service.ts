import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://192.168.1.93:3000'; // Usa la IP del servidor

  constructor(private http: HttpClient) {}

  obtenerUsuario(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuario/${id}`);
  }

    // Método para hacer login
    login(usuario: string, password: string): Observable<any> {
      return this.http.post(`${this.apiUrl}/login`, { usuario, password });
    }

  // Método para añadir usuarios
  crearUsuario(usuario: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/crear`, { usuario, password });
  }

  // Método para listar usuarios
  listarUsuarios(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios`);
  }

  // Método para editar un usuario
  editarUsuario(id: string, usuario: string, password: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuarios/editar/${id}`, { usuario, password });
  }

  // Método para eliminar un usuario
  eliminarUsuario(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/usuarios/eliminar/${id}`);
  }

  // Método para modificar el estado del portón
  modificarEstado(estado: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/modificarEstado`, { estado });
  }

  agregarCodigo(userId: string, codigo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/codigos/agregar`, { userId, codigo });
  }

  // Método para obtener los códigos de un usuario
  obtenerCodigos(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/codigos/${userId}`);
  }

  eliminarCodigo(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/codigos/eliminar/${id}`);
  }

  registrarPlaca(placa: string, usuarioPropietario: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/placas/registrar`, { placa, usuarioPropietario });
  }

  eliminarPlacasPorUsuario(usuario: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/placas/eliminarPorUsuario/${usuario}`);
  }

  registrarTarjeta(id: string, propietario: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/tarjetas/registrar`, { id, propietario });
  }


  
}