import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from './../share/share.module';
import { ArrayboxesRoutingModule } from './arrayboxes-routing.module';
import { ArrayboxesComponent } from './arrayboxes.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ArrayboxesRoutingModule
  ],
  declarations: [ArrayboxesComponent]
})
export class ArrayboxesModule { }
