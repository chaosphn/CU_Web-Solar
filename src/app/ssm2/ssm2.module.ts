import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from './../share/share.module';
import { Ssm2RoutingModule } from './ssm2-routing.module';
import { Ssm2Component } from './ssm2.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    Ssm2RoutingModule
  ],
  declarations: [Ssm2Component]
})
export class Ssm2Module { }
