import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { CommonModule } from '@angular/common';
import {InfiniteScrollModule} from 'ngx-infinite-scroll'
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, InfiniteScrollModule, FormsModule ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {
  usuarios: any = [];
  page: number = 1; // Página actual
  isLoading: boolean = false; // Estado de carga
  searchText: string = ''; // Variable para el texto de búsqueda
  filteredUsuarios: any = []; // Usuarios filtrados por búsqueda

  constructor (private adminService:AdminService) {}
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
          !this.usuarios.some((existingUser:any) => existingUser.id === user.id)
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
      usuario.nombre.toLowerCase().includes(this.searchText.toLowerCase()) || 
      usuario.correo.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }


}
