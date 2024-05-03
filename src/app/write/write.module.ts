import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from './../share/share.module';
import { WriteRoutingModule } from './write-routing.module';
import { WriteComponent } from './write.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WriteRoutingModule
  ],
  declarations: [WriteComponent]
})
export class WriteModule { }
