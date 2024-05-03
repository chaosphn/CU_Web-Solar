import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from './../share/share.module';
import { InvertersRoutingModule } from './inverters-routing.module';
import { InvertersComponent } from './inverters.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    InvertersRoutingModule,
  ],
  declarations: [InvertersComponent]
})
export class InvertersModule { }
