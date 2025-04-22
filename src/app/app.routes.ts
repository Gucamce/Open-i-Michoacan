import { Routes } from '@angular/router';
import { LoginComponent } from './Paginas/login/login.component';
import { InicioComponent } from './Paginas/inicio/inicio.component';
import { AppComponent } from './app.component';
import { AdminusersComponent } from './Paginas/adminusers/adminusers.component';

export const routes: Routes = [

    {path:'', redirectTo: 'login', pathMatch:'full'},
    {path:'login', component:LoginComponent},
    {path:'inicio',component:InicioComponent},
    {path: 'adminusers', component: AdminusersComponent}

];
