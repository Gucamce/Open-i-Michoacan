import { Routes } from '@angular/router';
import { LoginComponent } from './Paginas/login/login.component';
import { InicioComponent } from './Paginas/inicio/inicio.component';
import { AdminusersComponent } from './Paginas/adminusers/adminusers.component';
import { DashboardComponent } from './Paginas/dashboard/dashboard.component';
import { OfitabComponent } from './Paginas/ofitab/ofitab.component';

import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [

    {path:'', redirectTo: 'login', pathMatch:'full'},
    {path:'login', component:LoginComponent},
    
    //Usuario Autenticado
    {path:'inicio',component:InicioComponent,
        canActivate:[AuthGuard],
        data:{roles:[1,2,3]}
    },
    
    //Usuarios con rol Administrador
    {path: 'adminusers', component: AdminusersComponent,
        canActivate: [RoleGuard],
        data: { roles: [1] } },
    
    //Usuarios con rol Cajero y Auditor
    {path: 'dashboard', component: DashboardComponent,
        canActivate: [RoleGuard],
        data: { roles: [1,2,3] } },
    
    //Usuarios con rol Administrador, Cajero y Auditor
    {path: 'ofitab', component: OfitabComponent,
        canActivate: [RoleGuard],
        data: { roles: [1,2,3] } },
];
