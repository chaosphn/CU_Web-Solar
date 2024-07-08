import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../share/share.module';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { MaterialModule } from './modules/material.module';
import { StoreModule } from './modules/store.module';
import { DashboardComponent } from '../dashboardtv/dashboard.component';


@NgModule({
  imports: [
    /* 3rd party libraries */
    CommonModule,
    NoopAnimationsModule,
    RouterModule,
    FormsModule,
    MaterialModule,
    SharedModule,
    HttpClientModule,
    StoreModule,
  ],
  declarations: [
      NavbarComponent,
      LoginComponent,
      PageNotFoundComponent
  ],
  exports: [
    
  ],
  providers: [
    DatePipe,
    DecimalPipe
  ]
})
export class CoreModule {
  /* make sure CoreModule is imported only by one NgModule the AppModule */
  constructor (
    @Optional() @SkipSelf() parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}
