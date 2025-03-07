import { Component, importProvidersFrom } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { LoginService } from './login.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [ContainerComponent, RowComponent, 
      ColComponent, CardGroupComponent, 
      TextColorDirective, CardComponent,ReactiveFormsModule,
       CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle],
})
export class LoginComponent {

  public  loginForm:FormGroup

  constructor(private loginService:LoginService,private fb:FormBuilder,
     private router:Router, private activatedRouter:ActivatedRoute ) { 

    this.loginForm = this.fb.group({
      usuario:['', [Validators.required]],
      contrasenia:['', [Validators.required]]
    })
  }

 

  IniciarSesion() {
    let usuario = this.loginForm.get('usuario')?.value;
    let contrasenia = this.loginForm.get('contrasenia')?.value;
  
    if (!usuario || !contrasenia) {
      alert('Por favor, ingresa tu usuario y contraseña.');
      return;
    }
    this.loginService.validacionIniciarSesion(usuario, contrasenia).subscribe({
      next: (response) => {
        if (response && response.id) {
          // Almacenar datos del usuario en un servicio o localStorage
          localStorage.setItem('usuario', JSON.stringify(response));
          this.router.navigateByUrl('/dashboard');
        } else {
          alert('Usuario o contraseña incorrectos.');
        }
      },
      error: (error) => {
        // console.error('Error al iniciar sesión:', error);
        alert('Ocurrió un error al iniciar sesión. Por favor, intenta de nuevo mas tarde.');
      }
    });
  }

  
}

