import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../share/share.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { OverviewConsumptionComponent } from './components/overview-consumption/overview-consumption.component';
import { HeaderInformationComponent } from './components/header-information/header-information.component';
import { FooterInfomationComponent } from './components/footer-infomation/footer-infomation.component';
import { OverallInfomationComponent } from './components/overall-infomation/overall-infomation.component';
import { NortheastInfomationComponent } from './components/northeast-infomation/northeast-infomation.component';
import { NorthwestInfomationComponent } from './components/northwest-infomation/northwest-infomation.component';
import { SoutheastInfomationComponent } from './components/southeast-infomation/southeast-infomation.component';
import { SouthwestInfomationComponent } from './components/southwest-infomation/southwest-infomation.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule
  ],
  declarations: [
    DashboardComponent,
    OverviewConsumptionComponent,
    HeaderInformationComponent,
    FooterInfomationComponent,
    OverallInfomationComponent,
    NortheastInfomationComponent,
    NorthwestInfomationComponent,
    SoutheastInfomationComponent,
    SouthwestInfomationComponent
  ]
})
export class DashboardModule { }
