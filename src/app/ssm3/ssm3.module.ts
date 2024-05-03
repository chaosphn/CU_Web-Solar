import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from './../share/share.module';
import { Ssm3RoutingModule } from './ssm3-routing.module';
import { Ssm3Component } from './ssm3.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    Ssm3RoutingModule
  ],
  declarations: [Ssm3Component]
})
export class Ssm3Module { }
