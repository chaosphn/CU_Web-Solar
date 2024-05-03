import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ServerErrorsInterceptor } from './routings/interceptors/server-error.interceptor';
import { TokenInterceptor } from './routings/interceptors/token.interceptor';
import { AppLoadService } from './share/services/app-load.service';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    AppRoutingModule,
  ],
  providers: [
    AppLoadService,
    { 
      provide: APP_INITIALIZER, 
      useFactory: init_app,
      deps: [AppLoadService], 
      multi: true 
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorsInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


export function init_app(appLoadService: AppLoadService) {
  return () => appLoadService.getSettings();
}
