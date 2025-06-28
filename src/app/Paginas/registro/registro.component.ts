import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { OficinaServices } from '../../Servicios/oficinas.services';

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
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,    
    ReactiveFormsModule,
    MatButtonToggleModule,
    FlexLayoutModule,
    CommonModule,
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})

export class RegistroComponent {
  userForm: FormGroup;
  errorMessage = '';

  rol: UserRol[] = [
    { value: 'admin-00', viewValue: 'Admin' },
    { value: 'auditor-01', viewValue: 'Auditor' },
    { value: 'cajero-02', viewValue: 'Cajero' },
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegistroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private oficinaServices: OficinaServices
  ) {
    this.userForm = this.fb.group({
      nombre: [this.data?.name || '', Validators.required],
      apellido: [this.data?.lastName || '', Validators.required],
      email: [this.data?.userName || '', [Validators.required, Validators.email]],
      password: [''],
      passwordConfirm: [''],
      idRol: [this.data?.idRol || '', Validators.required],
    });

    const emailControl = this.userForm.get('email');
    if (emailControl) {
      merge(emailControl.statusChanges, emailControl.valueChanges)
        .pipe(takeUntilDestroyed())
        .subscribe(() => this.updateErrorMessage());
    }
  }

  updateErrorMessage() {
    const emailControl = this.userForm.get('email');
    if (emailControl?.hasError('required')) {
      this.errorMessage = 'Ingresa un correo';
    } else if (emailControl?.hasError('email')) {
      this.errorMessage = 'Usuario no válido';
    } else {
      this.errorMessage = '';
    }
  }

  onSubmit() {
    
    if (this.userForm.invalid) {
      this.errorMessage = 'Formulario inválido';
      console.log(this.userForm.value);
      return;
    }
    
    const formData = this.userForm.value;

    if (formData.password && formData.password !== formData.passwordConfirm) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    const usuarioActualizado = {
      id: this.data?.id,
      name: formData.nombre,
      lastName: formData.apellido,
      userName: formData.email,
      type: formData.idRol,
      password: formData.password || undefined,
    };

    this.oficinaServices.editarUsuario(usuarioActualizado).subscribe({
      next: () => {
        console.log('Usuario actualizado correctamente');
        this.dialogRef.close(true); // <- devuelve true para refrescar la tabla
      },
      error: (error) => {
        console.error('Error al actualizar el usuario:', error);
        this.errorMessage = 'Error al actualizar el usuario';
      }
    });
  }
}
