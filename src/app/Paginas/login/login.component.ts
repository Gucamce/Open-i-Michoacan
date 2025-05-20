
 
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../Servicios/login.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

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
    CommonModule,
  ],
  
})
export class LoginComponent implements OnInit {
  usuario: string = '';
  pass: string = '';
  hide: boolean = true;
  cargando: boolean = false;
  errorLogin: string = '';

  constructor(private loginService: LoginService, 
    private route:Router

   ) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    
  }
   iniciarSesion() {
    this.errorLogin = '';

    if (!this.usuario || !this.pass) {
      this.errorLogin = 'Por favor, ingresa tu usuario y contraseña';
      return;
    }

    this.cargando = true;

    this.loginService.login(this.usuario, this.pass).subscribe({
      next: (respuesta) => {

      console.log('respuesta', respuesta);

      localStorage.setItem("TK", respuesta.token),
      localStorage.setItem("BRANCH",JSON.stringify(respuesta.lstBranch)),

      this.route.navigate (["/inicio"])
    },
    error: (err) => {

      console.error("Error en logion:", err);
      this.cargando = false;

      if (err.status === 401){
        this.errorLogin = 'Usuario o contraseña incorrectos.';
      } else if (err.status === 0) {
        this.errorLogin = 'No se puede conectar con el servidor.';
      } else {
        this.errorLogin = err.error?.message || 'Error al inciar sesión.'; 
      }
 
    }
   }); 
  }
}