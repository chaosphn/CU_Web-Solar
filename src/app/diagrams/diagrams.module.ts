import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../share/share.module';
import { DiagramsRoutingModule } from './diagrams-routing.module';
import { DiagramsComponent } from './diagrams.component';



@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DiagramsRoutingModule
  ],
  declarations: [
    DiagramsComponent]
})
export class DiagramsModule { }
