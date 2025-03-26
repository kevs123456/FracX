import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { AlertController } from '@ionic/angular'; // Para mostrar alertas

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class ContactPage {
  name: string = '';
  email: string = '';
  message: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  sendMessage() {
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('email', this.email);
    formData.append('message', this.message);

    this.http.post('https://192.168.1.200/FracX/email.php', formData).subscribe(
      (response: any) => {
        if (response.success) {
          this.successMessage = 'Mensaje enviado correctamente';
          this.errorMessage = '';
        } else {
          this.errorMessage = response.error;
          this.successMessage = '';
        }
      },
      (error) => {
        this.errorMessage = 'Error al enviar el mensaje';
        this.successMessage = '';
      }
    );
  }
}
