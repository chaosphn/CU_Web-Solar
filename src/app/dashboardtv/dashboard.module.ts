import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../share/share.module';
import { DailyConsumptionComponent } from './components/daily-consumption/daily-consumption.component';
import { DailyConsumptionComponent2 } from './components/daily-consumption2/daily-consumption.component';
import { SiteInformationComponent } from './components/site-information/site-information.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { OverviewConsumptionComponent } from './components/overview-consumption/overview-consumption.component';
import { EnviConsumptionComponent } from './components/envi-consumption/envi-consumption.component';
import { ChartConsumptionComponent } from './components/chart-consumption/chart-consumption.component';
import { MapConsumtionComponent } from './components/map-consumtion/map-consumtion.component';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule,
    FormsModule,
    MatToolbarModule
  ],
  declarations: [
    DashboardComponent,
    SiteInformationComponent,
    DailyConsumptionComponent,
    DailyConsumptionComponent2,
    OverviewConsumptionComponent,
    EnviConsumptionComponent,
    ChartConsumptionComponent,
    MapConsumtionComponent
  ]
})
export class DashboardModule { }
