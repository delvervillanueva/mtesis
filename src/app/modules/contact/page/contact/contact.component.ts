import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, NgForm } from '@angular/forms';
import { ServiceEmailService } from '../../../../core/service/service-email.service'
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {

  title = "metatesisperu";
  loading = false;
  buttionText = "Submit";

  public formLogin: FormGroup;

   showSuccessMessage = false;
   formData = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  @ViewChild('miFormulario') miFormulario!: NgForm;


  constructor( private formBuilder: FormBuilder, public serviceEmailService: ServiceEmailService) {}

  ngOnInit(): void {
    this.formLogin = this.formBuilder.group({
      name:['', Validators.required],
      phone:['', Validators.required],
      email:['', [Validators.required, Validators.email]],
      message:['', []]

    })
  }

 enviarFormulario() {
      if (this.miFormulario.invalid) {
        this.miFormulario.control.markAllAsTouched(); // fuerza mostrar errores
        return;
      }
      const endpoint = 'https://formspree.io/f/mblaldyq';
  
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.formData),
      })
        .then((res) => {
          if (res.ok) {
            this.showSuccessMessage = true;
            this.formData = { name: '', phone: '', email: '', message: ''  }; // limpia modelo
            this.miFormulario.resetForm(); // limpia campos

            // 🔥 Aquí va tu evento GA4 personalizado
         /*    window.gtag?.('event', 'formulario_enviado', {
              nombre: this.formData.name,
              correo: this.formData.email,
              mensaje: this.formData.message,
            });
   */
            setTimeout(() => {
              this.showSuccessMessage = false;
            }, 9000); // Ocultar mensaje después de 8s
          } else {
            alert('Error al enviar el mensaje.');
          }
        })
        .catch(() => {
          alert('Error al enviar el mensaje.');
        });
    }


}
