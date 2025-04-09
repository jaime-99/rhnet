import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);

  // Obtener el usuario desde el localStorage
  const user = JSON.parse(localStorage.getItem('usuario') || '{}');

  // Verificar si el usuario está autenticado y si tiene el tipo de usuario 'admin'
  if (user?.tipo_usuario_id == 1) { // Suponiendo que el tipo 2 es el de administrador
    return true;  // Permitir el acceso
  }

  // Si no es administrador, redirigir a la página de acceso denegado
  router.navigate(['/sin-acceso']);
  return false;  // No permitir el acceso
};
