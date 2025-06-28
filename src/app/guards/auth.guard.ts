import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const idRol = localStorage.getItem('idRol');

    if (!idRol) {
      this.router.navigate(['/login']);
      return false;
    }

    return true; // permite acceso si hay rol guardado
  }
}
