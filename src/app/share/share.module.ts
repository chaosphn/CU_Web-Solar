import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';
import { NgxMasonryModule } from 'ngx-masonry';
import { MaterialModule } from '../core/modules/material.module';
import { DialogTagComponent } from './components/dialog-tag/dialog-tag.component';
import { PeriodComponent } from './components/period/period.component';
import { ReportComponent } from './components/report/report.component';
import { SatChartComponent } from './components/sat-chart/sat-chart.component';
import { SolarContainerComponent } from './components/solar-container/solar-container.component';
import { TagGroupComponent } from './components/tag-group/tag-group.component';
import { TimeControlComponent } from './components/time-control/time-control.component';
import { TimePresetComponent } from './components/time-preset/time-preset.component';
import { HighchartModules } from './modules/highchart.module';
import { MyNumberPipe } from './pipe/my-number.pipe';
import { DialogCtlComponent } from './components/dialog-ctl/dialog-ctl.component';
import { DialogSiteComponent } from './components/dialog-site/dialog-site.component';
import { WeatherCardComponent } from './components/weather-card/weather-card.component';
import { MyContainerComponent } from './components/my-container/my-container.component';
import { CircleProgressComponent } from './components/circle-progress/circle-progress.component';
import { SatChart2Component } from './components/sat-chart2/sat-chart2.component';
import { CuContainerComponent } from './components/cu-container/cu-container.component';
import { StackChartComponent } from './components/stack-chart/stack-chart.component';
import { CardBuidingComponent } from './components/card-buiding/card-buiding.component';
import { TooltipHorizontalComponent } from './components/tooltip-horizontal/tooltip-horizontal.component';
import { TooltipVerticalComponent } from './components/tooltip-vertical/tooltip-vertical.component';
import { SatChart3Component } from './components/sat-chart3/sat-chart3.component';
import { DialogbreakerComponent } from './components/dialogbreaker/dialogbreaker.component';
import { OrderByPipe } from './pipe/order-by.pipe';
import { FilterNamePipe } from './pipe/filter-name.pipe';
import { Number2Pipe } from './pipe/my-number2.pipe';
import { CardBreakerComponent } from './components/card-breaker/card-breaker.component';
import { ReportPipe } from './pipe/report.pipr';
import { DateControlComponent } from './components/date-control/date-control.component';
import { MapContainerComponent } from './components/map-container/map-container.component';
import { DiagramBuildingComponent } from './components/diagram-building/diagram-building.component';
import { FixPointPipe } from './pipe/fix-point.pipe';
import { SatChart1Component } from './components/sat-chart1/sat-chart1.component';
import { ObserveVisibilityDirective } from './services/scrolldetection';




export const MY_MOMENT_FORMATS = {
  parseInput: 'YYYY-MM-DD',
  fullPickerInput: 'YYYY-MM-DD HH:mm',
  datePickerInput: 'YYYY-MM-DD',
  timePickerInput: 'YYYY-MM-DD',
  monthYearLabel: 'YYYY-MM-DD',
  dateA11yLabel: 'YYYY-MM-DD',
  monthYearA11yLabel: 'YYYY-MM-DD',
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HighchartModules,
    ReactiveFormsModule,
    MaterialModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    OwlMomentDateTimeModule,
    NgxMasonryModule,
    // NoopAnimationsModule
  ],
  declarations: [
    SolarContainerComponent,
    PeriodComponent,
    SatChartComponent,
    TagGroupComponent,
    TimePresetComponent,
    TimeControlComponent,
    ReportComponent,
    DialogTagComponent,
    MyNumberPipe,
    DialogCtlComponent,
    DialogSiteComponent,
    WeatherCardComponent,
    MyContainerComponent,
    CircleProgressComponent,
    SatChart2Component,
    CuContainerComponent,
    StackChartComponent,
    CardBuidingComponent,
    TooltipHorizontalComponent,
    TooltipVerticalComponent,
    SatChart3Component,
    DialogbreakerComponent,
    CardBreakerComponent,
    OrderByPipe,
    FilterNamePipe,
    Number2Pipe,
    ReportPipe,
    DateControlComponent,
    MapContainerComponent,
    DiagramBuildingComponent,
    FixPointPipe,
    SatChart1Component,
    ObserveVisibilityDirective
  ],
  entryComponents: [
    DialogTagComponent,
    DialogCtlComponent,
    DialogSiteComponent,
    DialogbreakerComponent,
    DiagramBuildingComponent
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HighchartModules,
    MaterialModule,
    SolarContainerComponent,
    PeriodComponent,
    SatChartComponent,
    TagGroupComponent,
    TimePresetComponent,
    TimeControlComponent,
    ReportComponent,
    DialogTagComponent,
    MyNumberPipe,
    DialogSiteComponent,
    WeatherCardComponent,
    MyContainerComponent,
    CircleProgressComponent,
    SatChart2Component,
    CuContainerComponent,
    StackChartComponent,
    CardBuidingComponent,
    TooltipHorizontalComponent,
    TooltipVerticalComponent,
    SatChart3Component,
    DialogbreakerComponent,
    CardBreakerComponent,
    OrderByPipe,
    FilterNamePipe,
    Number2Pipe,
    ReportPipe,
    DateControlComponent,
    MapContainerComponent,
    DiagramBuildingComponent,
    FixPointPipe,
    SatChart1Component,
    ObserveVisibilityDirective
  ],
  providers: [
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS},
],
})
export class SharedModule { }
