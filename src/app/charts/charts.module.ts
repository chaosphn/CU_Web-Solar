import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../share/share.module';
import { ChartsRoutingModule } from './charts-routing.module';
import { ChartsComponent } from './charts.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ChartsRoutingModule
  ],
  declarations: [ChartsComponent]
})
export class ChartsModule { }
