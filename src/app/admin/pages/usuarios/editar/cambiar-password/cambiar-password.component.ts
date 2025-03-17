import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../service/admin.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { delay } from 'rxjs';
@Component({
  selector: 'app-cambiar-password',
  imports: [ReactiveFormsModule, CommonModule, ToastModule],
  templateUrl: './cambiar-password.component.html',
  styleUrl: './cambiar-password.component.scss'
})
export class CambiarPasswordComponent implements OnInit {

  @Input() usuario: any; // Recibir los datos del usuario
  @Output() close1 = new EventEmitter<void>(); // Evento para cerrar 

  formPassword: FormGroup = new FormGroup({}); // Inicialización para evitar errores

  constructor ( private fb:FormBuilder, private adminService:AdminService, private messageService:MessageService) {}

  ngOnInit(): void {
    this.formPassword = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(5)]], // Asegúrate de usar un array de validadores
      passwordRepeat: ['', [Validators.required, Validators.minLength(5)]]
    }, { 
      validators: this.passwordsMatchValidator // Asegúrate de que el validador esté aquí
    });
  }

  passwordsMatchValidator: ValidatorFn = (form: AbstractControl): ValidationErrors | null => {
    const password = form.get('password')?.value;
    const passwordRepeat = form.get('passwordRepeat')?.value;
    return password === passwordRepeat ? null : { passwordMismatch: true };
  };

  cambiarContrasenia(){
    let datos = {
      usuario_id:this.usuario.id,
      contrasenia:this.formPassword.get('password')?.value
    }

    if(this.formPassword.valid){
      this.adminService.cambiarContrasenia(datos.usuario_id,datos.contrasenia).pipe(
        delay(1450)
      ).subscribe({
        next:(res)=>{
          // console.log(res)
          this.messageService.add({ severity: 'success', summary: 'Hecho', detail: 'Has Cambiado la Contraseña', life: 3000 });

        }
      })
    }
  }

}
