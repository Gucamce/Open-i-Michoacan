import { Component } from '@angular/core';
import { UsertabComponent } from '../usertab/usertab.component';
import { MatTabsModule } from '@angular/material/tabs';
import { RegistroComponent } from '../registro/registro.component';
import { OfitabComponent } from '../ofitab/ofitab.component';

@Component({
  selector: 'app-adminusers',
  standalone: true,
  imports: [
    UsertabComponent,
    RegistroComponent,
    MatTabsModule,
    OfitabComponent,
  ],
  templateUrl: './adminusers.component.html',
  styleUrl: './adminusers.component.css'
})

export class AdminusersComponent{}
