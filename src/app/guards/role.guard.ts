import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const allowedRoles: number[] = route.data['roles'] || [];

    const idRolStr = localStorage.getItem('idRol');
    if (!idRolStr) {
      // No hay rol en localStorage → usuario no autenticado
      this.router.navigate(['/login']);
      return false;
    }

    const userRole = Number(idRolStr);

    if (allowedRoles.includes(userRole)) {
      return true;
    }

    // Rol no permitido
    this.router.navigate(['/login']);
    return false;
  }
}
