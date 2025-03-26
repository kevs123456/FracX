import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { AlertController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewChild, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';

declare var grecaptcha: any;

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class ContactPage {
  @ViewChild('contactForm') contactForm!: NgForm;
  
  name: string = '';
  email: string = '';
  message: string = '';
  phone: string = ''; 
  successMessage: string = '';
  errorMessage: string = '';
  recaptchaVerified = true; // Changed to true by default
  recaptchaSiteKey = '6LeS5fsqAAAAAGDcO9Q60iyaL1B25abBO0hILwK8';
  recaptchaWidgetId: any = null;

  constructor(private http: HttpClient, private ngZone: NgZone) {}

  ionViewDidEnter() {
    // No need to load reCAPTCHA since it's disabled
  }

  share() {
    console.log('Compartir página');
    if (navigator.share) {
      navigator.share({
        title: 'Fracx - Control de Acceso',
        text: 'Conoce las soluciones innovadoras de Fracx para control de acceso',
        url: window.location.href,
      }).catch(error => console.log('Error al compartir', error));
    }
  }

  sendMessage() {
    // Skip reCAPTCHA verification since it's disabled
    if (!this.contactForm.valid) {
      this.errorMessage = 'Por favor, completa todos los campos requeridos.';
      return;
    }

    const formData = {
      name: this.name,
      email: this.email,
      phone: this.phone,
      message: this.message
      // Removed g-recaptcha-response since it's not needed
    };

    const url = 'https://formspree.io/f/mdkedpap';
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    this.http.post(url, formData, { headers }).subscribe(
      (response: any) => {
        if (response.ok) {
          this.successMessage = '✅ Mensaje enviado correctamente';
          this.errorMessage = '';
          this.resetForm();
        } else {
          this.errorMessage = '❌ Error al enviar el mensaje';
        }
      },
      (error) => {
        this.errorMessage = '🔌 Error de conexión con el servidor';
        console.error('Error detallado:', error);
      }
    );
  }

  resetForm() {
    this.name = '';
    this.email = '';
    this.phone = '';
    this.message = '';
    this.recaptchaVerified = true; // Keep it true
    this.contactForm.resetForm();
  }
}