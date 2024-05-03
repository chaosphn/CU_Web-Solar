import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SharedModule } from './../share/share.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PdfViewerModule,
    ReportsRoutingModule
  ],
  declarations: [ReportsComponent]
})
export class ReportsModule { }
