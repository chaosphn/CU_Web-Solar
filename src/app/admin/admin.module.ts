import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../share/share.module';
import { AdminComponent } from './admin.component';
import { MaterialModule } from '../core/modules/material.module';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    MaterialModule
  ],
  declarations: [
    AdminComponent
  ]
})
export class AdminModule { }
