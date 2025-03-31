import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { AlertController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewChild, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastController } from '@ionic/angular'; // Añade esta importación

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
  recaptchaVerified = true;
  recaptchaSiteKey = '6LeS5fsqAAAAAGDcO9Q60iyaL1B25abBO0hILwK8';
  recaptchaWidgetId: any = null;

  constructor(
    private http: HttpClient, 
    private ngZone: NgZone,
    private alertController: AlertController,
    private toastController: ToastController // Añade esto
  ) {}

  ionViewDidEnter() {
    // No need to load reCAPTCHA since it's disabled
  }

  async share() {
    console.log('Compartir información de contacto');
    const shareData = {
      title: 'Fracx - Contáctanos',
      text: 'Para más información sobre nuestros servicios, contáctanos en nuestras redes sociales: \n📌 Facebook: https://www.facebook.com/profile.php?id=61574577937867\n🐦 Twitter: https://x.com/_Frac_X\n📷 Instagram: https://www.instagram.com/_frac_x/\n📺 YouTube: https://www.youtube.com/@Frac_X',
    };

    try {
      // Intentar usar la Web Share API primero
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback para navegadores que no soportan Web Share API
        await this.showShareFallback(shareData);
      }
    } catch (error) {
      console.log('Error al compartir', error);
      // Mostrar opciones de copiar manualmente si falla
      await this.showCopyOptions(shareData.text);
    }
  }

  private async showShareFallback(shareData: any) {
    const alert = await this.alertController.create({
      header: 'Compartir',
      message: 'Elige cómo quieres compartir esta información:',
      buttons: [
        {
          text: 'Copiar enlace',
          handler: () => this.copyToClipboard(shareData.text)
        },
        {
          text: 'Compartir por email',
          handler: () => this.shareByEmail(shareData)
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  private async showCopyOptions(text: string) {
    const alert = await this.alertController.create({
      header: 'Compartir',
      message: 'Tu navegador no soporta compartir directamente. Copia el texto manualmente:',
      inputs: [
        {
          name: 'shareText',
          type: 'textarea',
          value: text,
          cssClass: 'share-textarea'
        }
      ],
      buttons: [
        {
          text: 'Copiar',
          handler: () => this.copyToClipboard(text)
        },
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  private async copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      const toast = await this.toastController.create({ // Usa ToastController aquí
        message: 'El texto ha sido copiado al portapapeles',
        duration: 2000, // Ahora sí puedes usar duration
        position: 'bottom'
      });
      await toast.present();
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
      // Fallback para navegadores más antiguos
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      
      const toast = await this.toastController.create({ // También aquí
        message: 'El texto ha sido copiado al portapapeles',
        duration: 2000,
        position: 'bottom'
      });
      await toast.present();
    }
  }

  private shareByEmail(shareData: any) {
    const subject = encodeURIComponent(shareData.title);
    const body = encodeURIComponent(shareData.text);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }
  
  sendMessage() {
    if (!this.contactForm.valid) {
      this.errorMessage = 'Por favor, completa todos los campos requeridos.';
      return;
    }

    const formData = {
      name: this.name,
      email: this.email,
      phone: this.phone,
      message: this.message
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
    this.recaptchaVerified = true;
    this.contactForm.resetForm();
  }
}
