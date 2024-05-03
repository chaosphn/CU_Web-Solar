import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from './../share/share.module';
import { CtlRoutingModule } from './ctl-routing.module';
import { CtlComponent } from './ctl.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CtlRoutingModule
  ],
  declarations: [CtlComponent],
})
export class CtlModule { }
