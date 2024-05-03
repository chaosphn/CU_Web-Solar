import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from './../share/share.module';
import { Ssm5RoutingModule } from './ssm5-routing.module';
import { Ssm5Component } from './ssm5.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    Ssm5RoutingModule
  ],
  declarations: [Ssm5Component]
})
export class Ssm5Module { }
