import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { UUID } from 'angular2-uuid';
import { Subscription, timer, Observable, Subject } from 'rxjs';
import { DashboardLastValuesStateModel, ItemParameters, Record } from '../core/stores/last-values/dashboard/dashboard-last-values.model';
import { TagsStateModel } from '../core/stores/tags/tags.model';
import { AddTags, TagsState } from '../core/stores/tags/tags.state';
import { MockDataService } from '../dashboard/services/mock-data.service';
import { DataRead } from '../share/models/data-read.model';
import { PeriodTime } from '../share/models/period-time';
import { ResponseData } from '../share/models/response-data.model';
import { ChartParameters, HAlign, LegendLayout, LegendParameter, Series, VAlingn, XAxisParameters, XAxisType } from '../share/models/sat-chart';
import { TagGrouping, TagInfo } from '../share/models/tag-group.model';
import { ValueType } from '../share/models/value-models/value-type.model';
import { DateTimeService } from '../share/services/datetime.service';
import { HttpService } from '../share/services/http.service';
import { AppLoadService } from './../share/services/app-load.service';
import { InverterConfigStateModel } from '../core/stores/configs/inverter/inverter-config.model';
import { InverterConfigsState } from '../core/stores/configs/inverter/inverter-config.state';
import { InverterLastValuesModel, InverterLastValuesStateModel, InverterResHistorian, InverterResRealtime } from '../core/stores/last-values/inverter/inverter-last-values.model';
import { InverterRequestStateModel, InverterReqHistorian } from '../core/stores/requests/inverter/inverter-request.model';
import { InverterRequestState, SetInverterRequest } from '../core/stores/requests/inverter/inverter-request.state';
import { InverterLastValuesState } from '../core/stores/last-values/inverter/inverter-last-values.state';
import { InverterConfig, InverterConfigModel } from '../share/models/inverter-config.model';
import { SetInverterConfigs } from './../core/stores/configs/inverter/inverter-config.state';
import { InverterTagService } from './services/inverter-tag.service';
import { InverterRequestService } from './services/inverter-request.service';
import { ChangeInverterLastValues, SetInverterValues } from '../core/stores/last-values/inverter/inverter-last-values.state'
import { InverterLastValuesService } from './services/inverter-last-values.service';
import { GroupData, GroupData1 } from '../share/models/value-models/group-data.model';
import { BuildingModel, SiteStateModel } from '../core/stores/sites/sites.model';
import { SitesState } from '../core/stores/sites/sites.state';
import { Select } from '@ngxs/store';
import {debounceTime } from 'rxjs/operators';
import { Router,NavigationEnd  } from '@angular/router';
import { LocalStorageService } from '../share/services/localstorage.service';
import { EventService } from '../share/services/event.service';
import { ReportData } from '../share/models/report.model';
import { PowerTagConfig } from '../share/models/power-config.model';

@Component({
  selector: 'app-inverters',
  templateUrl: './inverters.component.html',
  styleUrls: ['./inverters.component.scss'],
})
export class InvertersComponent implements OnInit, AfterViewInit, OnDestroy {
  @Select(SitesState.getSites) sites$:Observable<SiteStateModel[]>;
  chartParameters: ChartParameters;
  groupConfig: TagGrouping[] = [];
  tagNames: string[] = [];
  config: PowerTagConfig;
  timerSubscription: Subscription;
  period: PeriodTime;
  periodName: string;
  reqCurrs: InverterReqHistorian[] = [];
  startTime: Date;
  endTime: Date;
  reportConfig: any[] = [];
  reportData: ReportData[][] = [];
  uuid: string;
  data: GroupData = {
    singleValue: {}
  };
  data2: GroupData1 = {
    singleValue: {}
  };
  unitConf: string[];
  subscriptions: Subscription[] = [];
  sub1:Subscription;
  siteSelected: SiteStateModel[];
  currentRoute: string;
  siteName: BuildingModel; 
  private unsubscribe$: Subject<void> = new Subject();
  private isInitialized = false;
  testGroup: any[][] = [];

  constructor(private httpService: HttpService,
    private store: Store,
    private appLoadService: AppLoadService,
    private cd: ChangeDetectorRef,
    private mockDataService: MockDataService,
    private InverterTagService: InverterTagService,
    private InverterRequestService: InverterRequestService,
    private InverterLastValuesService: InverterLastValuesService,
    private dateTimeService: DateTimeService,
    private router: Router,
    private storageService: LocalStorageService,
    private event: EventService) {
    this.sub1 = this.event.triggerFunction$.subscribe(() => {
      this.updateInit();
    });  
    }


    async ngOnInit() {
      this.uuid = UUID.UUID();
      this.currentRoute = this.router.url.toString()
      const building = localStorage.getItem('location');
      ////console.log("component: "+this.currentRoute.slice(6)+" & site: " + this.siteName.toString());
      this.siteName = JSON.parse(building);
      await this.init();
      await this.Init2();
       
    }
  
    async updateInit(){
      const building = localStorage.getItem('location');
      this.siteName = JSON.parse(building);
      this.initChart();
      this.initDateTime();
      await this.init();
      await this.Init2();
    }
  
    ngOnDestroy() {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
      this.unsubscribe();
      this.subscriptions.forEach(sub => {
        sub.unsubscribe();
      });
      this.sub1.unsubscribe();
    }
  
    async Init2(){
      const hasval: InverterLastValuesStateModel[] = this.store.selectSnapshot(InverterLastValuesState)
  
      
        //const InverterConfig = await this.getInverterConfigs();
        const InverterConfig = await this.convertConfig();
        ////console.log(InverterConfig)
        const models = this.transformDiagramConfig(InverterConfig);
        const requests = this.createRequests(InverterConfig);
        ////console.log(requests)
        await this.store.dispatch(new SetInverterRequest({
          Realtime: requests,
          Historian: []
        })).toPromise();
        const data = await this.requestData();
        ////console.log(data);
        const dataTF = await this.addRealtimeDataToStore(data);
        let dataTranform = [].concat(dataTF);
        await this.addDataToStore(dataTranform);
      
  
      const tagConfig: TagGrouping = {
        Category: "",
        Groups: [],
        Aliases: []
      }; 
      const Tag = await this.requestTags(this.config);
      //console.log(Tag);
    this.groupConfig = [];
      if(Tag){
        tagConfig.Category = "Inverter";
        Tag.forEach( i => {
          let display = i.Name.split(".");
          if(this.reportConfig.find(x => x.Name == display[0]) && !tagConfig.Groups.find(x=>x.Name == display[0])){
            tagConfig.Groups.push({
              Name: display[0],
              FullPath: i.Group,
              active: false,
              Display: display[0],
            });
          } 
          if(!tagConfig.Aliases.find(x=>x.Name == display[1])){
            tagConfig.Aliases.push({
              Name: display[1],
              active: false,
              Display: display[1],
            });
          }
        });
        this.groupConfig.push(tagConfig);
      }
      ////console.log(this.groupConfig);
  
      this.loadSingleValue();
      this.startTimer2(this.appLoadService.Config.Timer * 60000);
      ////console.log(this.data2)
      //this.getTaginfo();
    }
  
    loadSingleValue() {
      const curr = this.InverterLastValuesService.getCurrentGroupData();
      this.data2.singleValue = { ...curr };
      ////console.log(curr);
      this.reportData = [];
      this.reportConfig.forEach((grp) => {   
        const report: ReportData[] = [];  
        (Object.keys(grp) as (keyof typeof grp)[]).forEach((key, index) => {
          const tagName = grp[key];
          const currRes = curr[tagName];
          let dataRecord: Record = null;
          if (currRes) {
            dataRecord = currRes.dataRecords[0];
          }
          report.push({
            name: key.toString(),
            tagName: tagName,
            value: (key === 'Name') ? grp[key] : (dataRecord) ? dataRecord.Value : '---',
            quality: (dataRecord) ? 'Good' : 'Good',
            timestamp: (dataRecord) ? dataRecord.TimeStamp : '---'
          });
        });
        this.reportData.push(report);  
      })
      ////console.log(this.reportData);
      this.cd.markForCheck();
    }
  
    async addDataToStore(data: InverterLastValuesModel[]) {
      ////console.log(data)
      await this.store.dispatch(new SetInverterValues(data)).toPromise();
    }
  
    async addRealtimeDataToStore(data: any[]) {
      const Datas: InverterResRealtime[] = data;
      let newData: InverterLastValuesModel[] = []
      Datas.forEach((item) => {
        let record:InverterLastValuesModel = {
          Name: item.Name,
          Mode: "Realtime",
          Unit: item.Unit,
          Min: item.Min,
          Max: item.Max,
          DataRecord: [{
            TimeStamp: item.TimeStamp,
            Value: item.Value
          }]
        }
        newData.push(record);
      });
      ////console.log(newData)
      return newData;
      ////console.log(newData)
      //await this.store.dispatch(new SetDashboardValues(newData)).toPromise();
    }
  
    async addHistorianDataToStore(data: any[]) {
      const Datas: InverterResHistorian[] = data;
      let newData: InverterLastValuesModel[] = []
      Datas.forEach((item) => {
        let record:InverterLastValuesModel = {
          Name: item.Name,
          Mode: "Historian",
          Unit: item.Unit,
          Min: item.Min,
          Max: item.Max,
          DataRecord: item.records
        }
        newData.push(record);
      });
      
      return newData;
      //await this.store.dispatch(new SetDashboardValues(newData)).toPromise();
    }
  
    async requestData(): Promise<any[]> {
      const requests = this.store.selectSnapshot(InverterRequestState.getRequestRealtime());
      const data = await this.httpService.getRealtime(requests);
      return data;
    }
  
    async requestTags(req: PowerTagConfig): Promise<TagInfo[]> {
      //const requests = this.store.selectSnapshot(InverterRequestState.getRequestRealtime());
      const data = await this.httpService.getTagsGroupConfig(req);
      return data;
    }
  
    createRequests(InverterConfigs: InverterConfigModel[]) {
      const requests = this.InverterRequestService.createRealtimeRequest(InverterConfigs);
      return requests;
  
    }
  
    ngAfterViewInit() {
      this.initChart();
    }
  
    unsubscribe() {
      if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
      }
    }
  
    async init() {
      //console.log("Init Page");
      this.config = await this.httpService.getNavConfig('assets/inverters/inv.tag-req['+this.siteName.id+'].json');
      this.reportConfig = await this.httpService.getConfig('assets/inverters/inv.report['+this.siteName.id+'].config.json');
      ////console.log(this.reportConfig);
      this.initDateTime();
    }
  
  
    async convertConfig()
    {
      const InverterConfig :InverterConfigModel[] = [];
      this.reportConfig.forEach((grp) => {     
        (Object.keys(grp) as (keyof typeof grp)[]).forEach((key, index) => {
          if(key != "Name"){
            InverterConfig.push({
              Name: grp[key],
              Title: "RealTime"
            })
          }
        });
      })
      ////console.log(InverterConfig)
      //this.InverterTagService.addServerName(InverterConfig);
      //const models = this.transformDiagramConfig(InverterConfig);
      //this.store.dispatch(new SetInverterConfigs(models));
      //Promise.all(InverterConfig);
      return InverterConfig;
    }
  
    private transformDiagramConfig(InverterConfig: InverterConfigModel[]) {
      const models: InverterConfigStateModel = {
        historianConfig: [],
        realtimeConfig: InverterConfig
      }
      this.store.dispatch(new SetInverterConfigs(models));
      return models;
    }
  
    initChart() {
      const _config = new ChartParameters(this.uuid);
      const series: Series[] = [];
      const data: [number, number][] = [];
      data.push([new Date().getTime(), 0]);
      const serie: Series = {
        name: 'empty',
        data: data,
        visible: false,
        showInLegend: false
      };
      const legend: LegendParameter = {
        legendEnable: false,
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
      //console.log(tagNames);
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
      //console.log("Tags: " + tagNames.length + "\nStart: " + startTime.toISOString()
      //+ "\nEnd: " + endTime.toISOString());
      //await this.store.dispatch(new AddTags(tagNames)).toPromise();
      this.reqCurrs = this.getReqDataConfig(tagNames ,st, ed);
      ////console.log(this.reqCurrs);
      const res = await this.httpService.getHistorian(this.reqCurrs);
      ////console.log(res);
      this.renderChart(res);
  
      if (this.periodName && this.periodName.toLowerCase() === 't') {
        this.startTimer(this.appLoadService.Config.Timer * 1000 * 12);
      }
      else {
        this.unsubscribe();
      }
    }
  
  
    renderChart(res:  InverterResHistorian[]) {
      const series: Series[] = [];
      res.forEach(r => {
        const data: [number, number][] = [];
        r.records.forEach(r1 => {
          const val = parseFloat(r1.Value);
          const time = new Date(r1.TimeStamp).getTime();
          data.push([time, val]);
        });
        const strtmp: string  = r.Name
        const serie: Series = {
          name: strtmp + ' (' + r.Unit + ')',
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
  
    getReqDataConfig( tags: string[], startTime: string, endTime: string) {
      //const tags: TagsStateModel[] = this.store.selectSnapshot(TagsState);
      //const tagsSelected = tags.filter(x => this.tagNames.indexOf(x.Name) !== -1);
      //const reqType = ValueType.Plot;
      //const itemIds = tagsSelected.map(x => x.Id);
      let req: InverterReqHistorian[] = [];
      tags.forEach(item => {
        let reqItem: InverterReqHistorian = {
          Name: item,
          Options: {
            Time: "",
            StartTime: startTime,
            EndTime: endTime
          }
        }
        req.push(reqItem);
      })
      ////console.log(req)
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
          this.initDateTime();
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
  
    startTimer2(dueTimer: number) {
      const _timer = timer(5000, dueTimer).subscribe(x => {
        this.timerTick();
      });
      this.subscriptions.push(_timer);
    }
  
    async timerTick() {
      const data = await this.requestData();
      ////console.log(data);
      const dataTF = await this.addRealtimeDataToStore(data);
      let dataTranform = [].concat(dataTF);
      await this.addDataToStore(dataTranform);
      this.loadSingleValue();
      const startTime = this.getLastTime();
      const endTime = this.dateTimeService.getDateTime(new Date());
      this.reqCurrs = this.getReqDataConfig(this.tagNames, startTime, endTime);
      const res: InverterResHistorian[] = await this.httpService.getHistorian(this.reqCurrs);
      if (res.length > 0) {
        this.updateChart(res);
      }
    }
  
    updateChart(res: InverterResHistorian[]) {
      res.forEach(item => {
        const data = this.getPoints(item.records);
        this.chartParameters.changeSerie(item.Name, data);
      });
    }
  
    // appendData(res: ResponseData) {
    //   res.DataSets.forEach(item => {
    //     const data = this.getPoints(item);
    //     this.chartParameters.addPoint(item.ItemName, data);
    //   });
    //   this.chartParameters.redraw();
    // }
  
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
  
    private getPoints(item: Record[]): [number, number][] {
      const data: [number, number][] = [];
      item.forEach(d => {
        data.push([new Date(d.TimeStamp).getTime(), +d.Value]);
      });
      return data;
    }

    
  }
  
  