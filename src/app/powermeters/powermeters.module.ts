import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from './../share/share.module';
import { PowermetersRoutingModule } from './powermeters-routing.module';
import { PowermetersComponent } from './powermeters.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PowermetersRoutingModule
  ],
  declarations: [PowermetersComponent]
})
export class PowermetersModule { }
