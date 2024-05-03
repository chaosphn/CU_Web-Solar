import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from './../share/share.module';
import { Ssm1RoutingModule } from './ssm1-routing.module';
import { Ssm1Component } from './ssm1.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    Ssm1RoutingModule
  ],
  declarations: [Ssm1Component]
})
export class Ssm1Module { }
