import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../share/share.module';
import { AdminComponent } from './admin.component';
import { MaterialModule } from '../core/modules/material.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    MaterialModule,
    FormsModule
  ],
  declarations: [
    AdminComponent
  ]
})
export class AdminModule { }
