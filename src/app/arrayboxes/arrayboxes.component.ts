import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { UUID } from 'angular2-uuid';
import { Subscription, timer } from 'rxjs';
import { DashboardLastValuesStateModel, ItemParameters } from '../core/stores/last-values/dashboard/dashboard-last-values.model';
import { TagsStateModel } from '../core/stores/tags/tags.model';
import { AddTags, TagsState } from '../core/stores/tags/tags.state';
import { MockDataService } from '../dashboard/services/mock-data.service';
import { DataRead } from '../share/models/data-read.model';
import { PeriodTime } from '../share/models/period-time';
import { ResponseData } from '../share/models/response-data.model';
import { ChartParameters, HAlign, LegendLayout, LegendParameter, Series, VAlingn, XAxisParameters, XAxisType } from '../share/models/sat-chart';
import { TagGrouping } from '../share/models/tag-group.model';
import { ValueType } from '../share/models/value-models/value-type.model';
import { DateTimeService } from '../share/services/datetime.service';
import { HttpService } from '../share/services/http.service';
import { AppLoadService } from './../share/services/app-load.service';

@Component({
  selector: 'app-arrayboxes',
  templateUrl: './arrayboxes.component.html',
  styleUrls: ['./arrayboxes.component.scss'],
})
export class ArrayboxesComponent implements OnInit, AfterViewInit, OnDestroy {

  chartParameters: ChartParameters;
  groupConfig: TagGrouping[] = [];
  tagNames: string[] = [];
  timerSubscription: Subscription;
  periodNames = ['T', '7D', '30D', '3M', '12M'];
  headerReport = ['Name', 'Status', 'WH', 'HZ', 'P', 'WAC', 'VAC1', 'VAC2', 'VAC3', 'IAC1', 'IAC2', 'IAC3', 'WDC', 'VDC', 'IDC1', 'IDC2', 'IDC3', 'IDC4', 'IDC5', 'IDC6', 'IDC7'];
  period: PeriodTime;
  periodName: string;
  reqCurrs: DataRead[] = [];
  startTime: Date;
  endTime: Date;
  reportConfig: any[] = [];
  uuid: string;
  constructor(private httpService: HttpService,
    private store: Store,
    private appLoadService: AppLoadService,
    private cd: ChangeDetectorRef,
    private mockDataService: MockDataService,
    private dateTimeService: DateTimeService) { }


    async ngOnInit() {
      this.uuid = UUID.UUID();
      await this.init();
     
    }
  
  
    ngAfterViewInit() {
      this.initChart();
    }

  ngOnDestroy() {
    this.unsubscript();
  }

  unsubscript() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  initChart() {
    const _config = new ChartParameters(this.uuid);
    const series: Series[] = [];
    const data: [number, number][] = [];
    data.push([new Date().getTime(), 0]);
    const serie: Series = {
      name: '',
      data: data,
      visible: false,
      showInLegend: false
    };
    const legend: LegendParameter = {
      legendEnable: true,
      lengendFloating: true,
      HorizontalAlign: HAlign.center,
      VerticalAlign: VAlingn.top,
      XPostion: 0,
      YPosition: -10,
  };

    series.push(serie);
    _config.addSeries(series);
    // _config.setLegend(legend);
    this.chartParameters = _config;
    this.cd.detectChanges();
  }


  async init() {
    const req: string[] = await this.httpService.getConfig('assets/arrayboxes/tag-req.json');
    this.groupConfig = await this.httpService.getGroupConfig(req);
    this.reportConfig = await this.httpService.getConfig('assets/arrayboxes/report.config.json');
    this.initDateTime();
  }


  initDateTime() {
    // this.periodName = 't';
    this.period = this.dateTimeService.parseDate('t');
    this.startTime = new Date(this.period.startTime);
    this.endTime = new Date(this.period.endTime);
  }

  // click
  selectOptions() {
    this.render(this.tagNames, this.startTime, this.endTime);
  }

  selectedTag(tagNames: string[]) {
    this.tagNames = tagNames;
    // if (this.tagNames.length === 0) {
    //   this.periodName = null;
    // }
  }

  selectedPeriod(periodName: string) {
    if (this.checkTagNames()) {
      this.periodName = periodName;     
      this.period = this.dateTimeService.parseDate(periodName);
      this.startTime = new Date(this.period.startTime);
      this.endTime = new Date(this.period.endTime);
      this.render(this.tagNames, this.startTime, this.endTime);
    }
    else {
      this.periodName = null;
    }
  }

  selectStartTime(newDate: Date) {
    this.startTime = newDate;
    this.periodName = null;
  }

  selectEndTime(newDate: Date) {    
    this.endTime = newDate;
    this.periodName = null;
  }

  checkTagNames(): boolean {
    if (this.tagNames.length === 0) {
      alert('Please select tags');
      return false;
    }
    return true;
  }

  async render(tagNames: string[], startTime: Date, endTime: Date) {
    this.validateParameters();
    const st = this.dateTimeService.getDateTime(startTime);
    const ed = this.dateTimeService.getDateTime(endTime);
    await this.store.dispatch(new AddTags(tagNames)).toPromise();
    this.reqCurrs = this.getReqDataConfig(st, ed);
    const res = await this.httpService.getData(this.reqCurrs);
    this.renderChart(res);

    if (this.periodName && this.periodName.toLowerCase() === 't') {
      this.startTimer(this.appLoadService.Config.Timer * 1000);
    }
    else {
      this.unsubscribe();
    }
  }


  renderChart(res: DashboardLastValuesStateModel[]) {
    const series: Series[] = [];
    res[0].DataSets.forEach(r => {
      const data: [number, number][] = [];
      r.Records.forEach(r1 => {
        const val = (r1.Quality === 'Bad') ? null : +r1.Value;
        const time = new Date(r1.Timestamp).getTime();
        data.push([time, val]);
      });
      const serie: Series = {
        name: r.ItemName.toString(),
        data: data
      };
      series.push(serie);
    });
    if (series.length > 0) {
      const id = UUID.UUID();
      const xaxis: XAxisParameters = new XAxisParameters();
      xaxis.labelType = XAxisType.datetime;
      const _config = new ChartParameters(id);
      const _legend: LegendParameter = new LegendParameter();

      _legend.VerticalAlign = VAlingn.top;
      _legend.layout = LegendLayout.vertical;
      _legend.HorizontalAlign = HAlign.right;
      _config.setLegend(_legend);
      _config.addSeries(series);
      _config.addXAxis(xaxis);
      _config.setTitle(null);
      this.chartParameters = _config;
    }
    this.cd.markForCheck();
  }

  getReqDataConfig(startTime: string, endTime: string): DataRead[] {
    const tags: TagsStateModel[] = this.store.selectSnapshot(TagsState);
    const tagsSelected = tags.filter(x => this.tagNames.indexOf(x.Name) !== -1);
    const reqType = ValueType.Plot;
    const itemIds = tagsSelected.map(x => x.Id);
    const req: DataRead[] = [
      {
        RequestId: this.uuid,
        Mode: reqType,
        ItemIds: itemIds,
        StartTime: startTime,
        EndTime: endTime,
        Interval: 2000
        // Name: id
      }
    ];
    return req;
  }


  validateParameters() {
    if (!this.startTime) {
      alert('please select start-time.');
      throw new Error('Start-time not selecting.');
    }
    else if (!this.endTime) {
      alert('please select end-time.');
      throw new Error('End-time not selecting.');
    }
    if (this.endTime.getTime && this.startTime.getTime) {
      const diff = this.endTime.getTime() - this.startTime.getTime();
      if (this.tagNames.length === 0) {
        alert('please select tags.');
        throw new Error('Tags not selecting.');
      }
  
      else if (diff <= 0) {
        alert('Start time should be less than end time.');
        throw new Error('Start time should be less than end time.');
      }
    }

  }

  startTimer(dueTimer: number) {
    // const _timer = timer(dueTimer, 3000).pipe(take(1)).subscribe(x => {
    this.unsubscribe();
    const _timer = timer(5000, dueTimer).subscribe(x => {
      this.timerTick();
    });
    this.timerSubscription = _timer;
  }

  async timerTick() {
    const startTime = this.getLastTime();
    const endTime = this.dateTimeService.getDateTime(new Date());
    this.reqCurrs = this.getReqDataConfig(startTime, endTime);
    const res: ResponseData[] = await this.httpService.getData(this.reqCurrs);
    if (res.length > 0) {
      this.updateChart(res[0]);
    }
  }

  updateChart(res: ResponseData) {
    res.DataSets.forEach(item => {
      const data = this.getPoints(item);
      this.chartParameters.changeSerie(item.ItemName, data);
    });
  }

  // appendData(res: ResponseData) {
  //   res.DataSets.forEach(item => {
  //     const data = this.getPoints(item);
  //     this.chartParameters.addPoint(item.ItemName, data);
  //   });
  //   this.chartParameters.redraw();
  // }

  unsubscribe() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  getLastTime(): string {
    const timeList: number[] = [];
    this.chartParameters.series.forEach(s => {
      const lastData = s.data[s.data.length - 1];
      const maxTime = lastData[0];
      timeList.push(maxTime);
    });
    const min = Math.min(...timeList);
    const dateTime = new Date(min);
    return (dateTime) ? this.dateTimeService.getDateTime(dateTime) : this.dateTimeService.getDateTime(this.startTime);
  }

  private getPoints(item: ItemParameters): [number, number][] {
    const data: [number, number][] = [];
    item.Records.forEach(d => {
      data.push([new Date(d.Timestamp).getTime(), +d.Value]);
    });
    return data;
  }
}
