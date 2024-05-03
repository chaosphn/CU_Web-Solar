import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../share/share.module';
import { DiagramRoutingModule } from './diagram-routing.module';
import { DiagramComponent } from './diagram.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DiagramRoutingModule,
  ],
  declarations: [
    DiagramComponent]
})
export class DiagramModule { }
