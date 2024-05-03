import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from './../share/share.module';
import { Ssm6RoutingModule } from './ssm6-routing.module';
import { Ssm6Component } from './ssm6.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    Ssm6RoutingModule
  ],
  declarations: [Ssm6Component]
})
export class Ssm6Module { }
