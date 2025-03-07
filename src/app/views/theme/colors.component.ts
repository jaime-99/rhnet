import { AfterViewInit, Component, HostBinding, Inject, Input, OnInit, Renderer2, forwardRef } from '@angular/core';
import { DOCUMENT, NgClass } from '@angular/common';

import { getStyle, rgbToHex } from '@coreui/utils';
import { TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, RowComponent, ColComponent } from '@coreui/angular';
import { PerfilService } from './services/perfil.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
    templateUrl: 'colors.component.html',
    imports: [ConfirmDialogModule,ReactiveFormsModule, ToastModule ],
    styleUrls:['./perfil.scss'],
    providers: [ConfirmationService, MessageService]
})
// componente de perfil donde se vera los datos del perfil del usuario
export class ColorsComponent implements OnInit {

  public usuario:any = ''
  constructor (private perfilService:PerfilService, private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router:Router
  ) { }

  correo = new FormControl(this.usuario.correo, [Validators.required, Validators.email]);
  
  ngOnInit(): void {

    const usuarioData:any = localStorage.getItem('usuario');
    this.usuario = JSON.parse(usuarioData);

    if (this.usuario?.correo) {
        this.correo.setValue(this.usuario.correo);
      }
  }


  actualizarDatos(event: Event) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Actualizar Datos?',
        header: 'Confirmacion',
        closable: true,
        closeOnEscape: true,
        icon: 'pi pi-exclamation-triangle',
        rejectButtonProps: {
            label: 'Cancelar',
            severity: 'secondary',
            outlined: true,
        },
        acceptButtonProps: {
            label: 'guardar',
        },
        accept: () => {
            const data = {
                id:this.usuario.id,
                correo:this.correo.value
            }
            if(data){
                this.perfilService.putUsuario(data).subscribe({
                    next:(res)=>{
                        this.router.navigateByUrl('/perfil/perfil', { skipLocationChange: true }).then(() => {
                            this.router.navigate([this.router.url]);
                          });

                            const updatedUser = { ...this.usuario, correo: this.correo.value };
                            localStorage.setItem('usuario', JSON.stringify(updatedUser));

                    },
                    complete:()=>{
                    this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Se Actualizaron tus Datos', life: 3000 });

                    }
                })
            }
        },
        reject: () => {
          
        },
    });
}


  




  


}



