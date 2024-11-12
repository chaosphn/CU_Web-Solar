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
import { HeaderInformationComponent } from './components/header-information/header-information.component';
import { FooterInfomationComponent } from './components/footer-infomation/footer-infomation.component';


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
    OverviewConsumptionComponent,
    EnviConsumptionComponent,
    HeaderInformationComponent,
    FooterInfomationComponent
  ]
})
export class DashboardModule { }
