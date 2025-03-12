import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdminService } from '../../../../service/admin.service';

@Component({
  selector: 'app-cambiar-password',
  imports: [],
  templateUrl: './cambiar-password.component.html',
  styleUrl: './cambiar-password.component.scss'
})
export class CambiarPasswordComponent implements OnInit {

  @Input() usuario: any; // Recibir los datos del usuario
  @Output() close1 = new EventEmitter<void>(); // Evento para cerrar el mo

  constructor (private adminService:AdminService) {}

  ngOnInit(): void {

  }

}
