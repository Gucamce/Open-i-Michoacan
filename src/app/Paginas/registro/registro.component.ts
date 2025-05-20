import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

interface UserRol {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    MatCardModule,
    MatCheckboxModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  nombre : any = '';
  apellido : any ='';
  email= new FormControl ('', [Validators.required, Validators.email]);

  errorMessage = '';

  selectedValue: string | undefined;

  rol: UserRol[] = [
    {value: 'admin-01', viewValue: 'Admin'},
    {value: 'auditor-02', viewValue: 'Auditor'},
    {value: 'cajero-03', viewValue: 'Cajero'},
  ];

  constructor() {
    merge(this.email.statusChanges, this.email.valueChanges)
    .pipe(takeUntilDestroyed())
    .subscribe(() => this.updateErrorMessage());

    
  }

  updateErrorMessage() {
    if (this.email.hasError ('required')) {
      this.errorMessage = 'Ingresa un correo';
    } else if (this.email.hasError('email')) {
      this.errorMessage = 'Usuario no valido';
    } else {
      this.errorMessage='';
    }
  }
  

}
