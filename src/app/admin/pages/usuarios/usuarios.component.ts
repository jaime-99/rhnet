import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { CommonModule } from '@angular/common';
import {InfiniteScrollModule} from 'ngx-infinite-scroll'
import { FormsModule } from '@angular/forms';
import { EditarComponent } from './editar/editar.component';
import {CambiarPasswordComponent} from '../usuarios/editar/cambiar-password/cambiar-password.component'
@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, InfiniteScrollModule, FormsModule, EditarComponent , CambiarPasswordComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {
  usuarios: any = [];
  page: number = 1; // Página actual
  isLoading: boolean = false; // Estado de carga
  searchText: string = ''; // Variable para el texto de búsqueda
  filteredUsuarios: any = []; // Usuarios filtrados por búsqueda
  isModalOpen: boolean = false;
  selectedUser: any;
  isModalOpen1: boolean = false;

  constructor (private adminService:AdminService, ) {}
  ngOnInit(): void {
    this.getAllUsers()
  }
  getAllUsers() {
    if (this.isLoading) return;

    this.isLoading = true; // Cambiar el estado de carga a verdadero

    this.adminService.getAllUsers().subscribe({
      next: (res) => {
        // Filtrar los usuarios duplicados antes de agregarlos
        const newUsers = res.filter((user:any) => 
          !this.usuarios.some((existingUser:any) => existingUser.usuario_id === user.usuario_id)
        );
        // Añadir los nuevos usuarios sin duplicar
        this.usuarios = [...this.usuarios, ...newUsers];
        this.page++; // Aumentar la página para la siguiente carga
        this.isLoading = false; // Cambiar el estado de carga a falso
        this.onSearchTextChange()
      },
      error: () => {
        this.isLoading = false; // Asegurarse de cambiar el estado de carga en caso de error
      }
    });
  }
  onSearchTextChange() {
    // Filtrar usuarios cuando cambie el texto de búsqueda
    this.filteredUsuarios = this.usuarios.filter((usuario: any) => 
      usuario.usuario_nombre.toLowerCase().includes(this.searchText.toLowerCase()) || 
      usuario.usuario_correo.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // primer boton de editar
  openEditModal(usuario: any) {
    this.selectedUser = usuario;
    this.isModalOpen = true; // Abrir el modal
  }
  closeModal() {
    this.isModalOpen = false; // Cerrar el modal
  }

  //segundo boton para cambiar contrasenia
  openEditModal2(usuario: any) {
    this.selectedUser = usuario;
    this.isModalOpen1 = true; // Abrir el modal
  }
  closeModal2() {
    this.isModalOpen1 = false; // Cerrar el modal
  }

}
