import { Component, OnInit } from '@angular/core';

import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';  // Importar el idioma español
import { Router } from '@angular/router';  // Importar Router

@Component({
  selector: 'app-capacitaciones-2',
  standalone: true,           
  imports: [FullCalendarModule],
  templateUrl: './capacitaciones-2.component.html',
  styleUrl: './capacitaciones-2.component.scss'
})
export class Capacitaciones2Component implements OnInit {
  constructor (private router:Router) { }

  showUploadButton:boolean = false;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    locale: esLocale,  // Aquí se asigna el idioma español,
    events: this.getWednesdayEvents(),  // Agregar eventos solo los miércoles
    eventClick: this.handleEventClick.bind(this),  // Manejador de clic en el evento

  };
  ngOnInit(): void {

  }
  handleEventClick(info:any) {
    // Redirige a la ruta sin recargar la página
    info.jsEvent.preventDefault();  // Previene la recarga de la página
    const selectedDate = info.event.start.toISOString().split('T')[0];  // Formato YYYY-MM-DD

    this.router.navigate([info.event.url], {queryParams:{fecha:selectedDate}});  // Navega a la URL que definiste en el evento
  }
  getWednesdayEvents() {
    const events:any = [];
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // Primer día del mes
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // Último día del mes
    
    // Iteramos sobre todas las fechas del mes
    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      // Si el día es miércoles (getDay() = 3)
      if (date.getDay() === 3) {
        events.push({
          title: 'Subir Evidencia',  // Título del evento
          date: date.toISOString().split('T')[0], // Fecha del evento
          description: 'Capacitación y evidencia a cargar', // Descripción
          url: 'capacitaciones/subir-evidencias', // Aquí puedes agregar la URL o lógica para abrir un formulario
          color: '#4CAF50', // Color del evento (opcional)
        });
      }
    }
    return events;
  }


  

}
