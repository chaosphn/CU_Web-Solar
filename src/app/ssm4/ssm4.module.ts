import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from './../share/share.module';
import { Ssm4RoutingModule } from './ssm4-routing.module';
import { Ssm4Component } from './ssm4.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    Ssm4RoutingModule
  ],
  declarations: [Ssm4Component]
})
export class Ssm4Module { }
