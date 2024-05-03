import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from './../share/share.module';
import { EventsRoutingModule } from './events-routing.module';
import { EventsComponent } from './events.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    EventsRoutingModule
  ],
  declarations: [EventsComponent]
})
export class EventsModule { }
