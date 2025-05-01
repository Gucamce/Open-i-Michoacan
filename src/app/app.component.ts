import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './Paginas/navbar/navbar.component';
import { FooterComponent } from './Paginas/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterOutlet],
//  templateUrl: './Paginas/login/login.component.html',
    templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'oi-mich_rdddi';
}
