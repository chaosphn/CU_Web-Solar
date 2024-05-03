import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../share/share.module';
import { DailyConsumptionComponent } from './components/daily-consumption/daily-consumption.component';
import { DailyConsumptionComponent2 } from './components/daily-consumption2/daily-consumption.component';
import { SiteInformationComponent } from './components/site-information/site-information.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { MapComponent } from './components/map/map.component';



@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule
  ],
  declarations: [
    DashboardComponent,
    SiteInformationComponent,
    DailyConsumptionComponent,
    DailyConsumptionComponent2,
    MapComponent
  ]
})
export class DashboardModule { }
