import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './Paginas/navbar/navbar.component';
import { FooterComponent } from './Paginas/footer/footer.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent,
    FooterComponent,
    RouterOutlet,
    CommonModule,
  ],
//  templateUrl: './Paginas/login/login.component.html',
    templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'oi-mich_rdddi';
  mostrarLayout: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe (event => {
      if(event instanceof NavigationEnd) {
        this.mostrarLayout = event.urlAfterRedirects != '/login';
      }
    });
  }
}
