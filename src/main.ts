import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
/*   import { bootstrapApplication } from '@angular/platform-browser';
  import { importProvidersFrom } from '@angular/core';
  import { HttpClientModule } from '@angular/common/http';  // Importa HttpClientModule
  import { appConfig } from './app/app.config';
  import { AppComponent } from './app/app.component';
  
  bootstrapApplication(AppComponent, {
    ...appConfig,
    providers: [
      importProvidersFrom(HttpClientModule)  // Agrega HttpClientModule aquí
    ]
  })
    .catch((err) => console.error(err)); */