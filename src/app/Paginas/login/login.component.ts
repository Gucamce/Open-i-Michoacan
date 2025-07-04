import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../Servicios/login.service';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule }from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSnackBarModule,
    CommonModule,
    RouterModule,
  ],
  
})
export class LoginComponent implements OnInit {
  usuario: string = '';
  pass: string = '';
  hide: boolean = true;
  cargando: boolean = false;
  errorLogin: string = '';

  constructor(
    private loginService: LoginService, 
    private route:Router,
    private snackBar: MatSnackBar,
   ) {}

  ngOnInit(): void {
   
    
    
  }
  
   iniciarSesion() {
    this.errorLogin = '';

    if (!this.usuario || !this.pass) {
      this.snackBar.open ('Por favor, ingresa tu usuario y contraseña', 'Cerrar', {
        duration: 4000,
      });
      return;
    }

    this.cargando = true;

    this.loginService.login(this.usuario, this.pass).subscribe({
      next: (res) => {

      console.log('respuesta completa del login:', JSON.stringify(res, null, 2));

      if (res.result){

        localStorage.clear();

      localStorage.setItem("TK", res.token);
      localStorage.setItem('lstBranch', JSON.stringify(res.lstBranch));
      localStorage.setItem('userName', res.name);
      localStorage.setItem('rol', res.rol);
      localStorage.setItem('idRol', res.idRol.toString());
      
      this.route.navigate (["/inicio"])
      } else{
        this.snackBar.open('Usuario o contraseña incorrectos', 'Cerrar', {
          duration: 4000,
        });
      }
    },
    error: (err) => {

      console.error("Error en logion:", err);
      this.cargando = false;

      if (err.status === 403){
        this.snackBar.open ('Usuario o contraseña incorrectos.', 'Cerrar', {
          duration: 4000,
        });
      } else if (err.status === 0) {
        this.snackBar.open ('No se puede conectar con el servidor.', 'Cerrar', {
          duration: 4000,
        });
      } else {
        this.snackBar.open (err.error?.message || 'Error al inciar sesión.', 'Cerrar', {
          duration:4000,
        }); 
      }
 
    }
   }); 
  }
}