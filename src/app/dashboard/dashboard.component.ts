import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { Subscription, timer, Observable } from 'rxjs';
import { DashboardConfigStateModel, DashboardConfigs, DashboardConfigsHistorian, DashboardConfigsRealtime } from '../core/stores/configs/dashboard/dashboard-configs.model';
import { ChangePeriodName, DashboardConfigsState, SetDashboardConfigs } from '../core/stores/configs/dashboard/dashboard-configs.state';
import { DashboardLastValuesModel, DashboardLastValuesStateModel, DashboardResHistorian, DashboardResRealtime, Record } from '../core/stores/last-values/dashboard/dashboard-last-values.model';
import { ChangeLastValues, ChangeLastValues1, DashboardLastValuesState, SetDashboardValues } from '../core/stores/last-values/dashboard/dashboard-last-values.state';
import { DashboardReqHistorian, DashboardRequestModel, DashboardRequestStateModel } from '../core/stores/requests/dashboard/dashboard-request.model';
import { ChangePeriod, ChangePeriod1, ChangeTagIds, SetDashboardRequest } from '../core/stores/requests/dashboard/dashboard-request.state';
import { AddTags } from '../core/stores/tags/tags.state';
import { ChartOptions } from '../share/models/chart-options.model';
import { Period } from '../share/models/period';
import { AppLoadService } from '../share/services/app-load.service';
import { DashboardRequestState } from './../core/stores/requests/dashboard/dashboard-request.state';
import { PeriodComponent } from './../share/components/period/period.component';
import { GroupData1, MultipleValue, GroupData } from './../share/models/value-models/group-data.model';
import { ValueType } from './../share/models/value-models/value-type.model';
import { DateTimeService } from './../share/services/datetime.service';
import { HttpService } from './../share/services/http.service';
import { DashboardChartService } from './services/dashboard-chart.service';
import { DashboardInverterService } from './services/dashboard-inverter.service';
import { DashboardLastValuesService } from './services/dashboard-last-values.service';
import { DashboardRequestService } from './services/dashboard-request.service';
import { DashboardTagService } from './services/dashboard-tag.service';
import { BuildingModel, SiteStateModel } from '../core/stores/sites/sites.model';
import { SitesState } from '../core/stores/sites/sites.state';
import { Select } from '@ngxs/store';
import {debounceTime } from 'rxjs/operators';
import { Router,NavigationEnd  } from '@angular/router';
import { LocalStorageService } from '../share/services/localstorage.service';
import { EventService } from '../share/services/event.service';
import { NavbarComponent } from '../core/components/navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  @Select(SitesState.getSites) sites$:Observable<SiteStateModel[]>;
  data: GroupData1 = {
    singleValue: {},
    multipleValue: {}
  };
  time: Date;
  subscriptions: Subscription[] = [];
  sub1: Subscription;
  chartConfigs: DashboardConfigStateModel[] = [];
  chartOptions: ChartOptions = {};
  periodSelected: Period;
  periods: Period[] = [
    {
      name: 't',
      display: 't'
    },
    {
      name: '7d',
      display: '7d'
    },
    {
      name: '30d',
      display: '30d'
    },
    {
      name: '3m',
      display: '3m'
    },
    {
      name: '12m',
      display: '12m'
    }
  ];
  siteSelected: SiteStateModel[];
  currentRoute: string;
  private isInitialized = false;
  siteName: BuildingModel;
  dataRealtime?: DashboardResRealtime[] = [];
  dataHistorian?: DashboardResHistorian[] = []


  @ViewChild('period1') period1: PeriodComponent;
  @ViewChild('period2') period2: PeriodComponent;
  @ViewChild('period3') period3: PeriodComponent;
  @ViewChild('period4') period4: PeriodComponent;

  constructor(private httpService: HttpService,
    private datePipe: DatePipe,
    private appLoadService: AppLoadService,
    private dashboardTagService: DashboardTagService,
    private dashboardRequestService: DashboardRequestService,
    private dashboardLastValuesService: DashboardLastValuesService,
    private dashboardChartService: DashboardChartService,
    private dateTimeService: DateTimeService,
    private cd: ChangeDetectorRef,
    private dashboardInverterService: DashboardInverterService,
    private store: Store,
    private router: Router,
    private storageService: LocalStorageService,
    private event: EventService,
    private check: NavbarComponent) {
    this.periodSelected = this.periods[0];
    this.sub1 = this.event.triggerFunction$.subscribe(() => {
      this.updateInit();
    });
  }

  ngOnInit() {
    //this.init();
    localStorage.setItem('nowUrl',this.router.url.toString());
    this.currentRoute = this.router.url.toString()
    const building = localStorage.getItem('location');
    ////console.log("component: "+this.currentRoute.slice(6)+" & site: " + this.siteName.toString());
    this.siteName = JSON.parse(building);
    this.init02();
  }

  updateInit(){
    const building = localStorage.getItem('location');
    this.siteName = JSON.parse(building);
    //console.log(JSON.parse(building))
    this.periodSelected = {
      name: 't',
      display: 't'
    };
    this.init02();
    this.cd.markForCheck();
  }

  ngAfterViewInit() {
    
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
    this.sub1.unsubscribe();
    
  }

  
  getPeakTime(sec: number) {
    const time = new Date();
    const timeISO = time.toISOString().split('.')[0];
    time.setHours(0, 0, 0, 0);
    time.setSeconds(sec);
    const timeStr = this.datePipe.transform(timeISO, 'HH:mm');
    this.cd.markForCheck();
    return timeStr;
  }

  configs01: DashboardConfigsRealtime[];
  configs02: DashboardConfigsHistorian[];

  private async init02()
  {
    //console.log("Init Page");
    {
      const dashboardConfigs = await this.getDashboardConfigs();
      ////console.log(dashboardConfigs);
      this.configs01 = dashboardConfigs.realtimeConfig;
      this.configs02 = dashboardConfigs.historianConfig;
      this.dashboardInverterService.config = dashboardConfigs.chartConfig.find(c => c.name === "interverEnergy");

      await this.createRequests02();
    
      const realtimeData = await this.requestRawData();
      const historianData = await this.requestPlotData();
      if (historianData) {
        this.dashboardInverterService.data = historianData.filter(x => x.Name.includes("INV"));
      }
      //await this.addDataToStore(rawData);
      const rawTF = await this.addRealtimeDataToStore(realtimeData);
      const hisTF = await  this.addHistorianDataToStore(historianData);
      let dataTranform = rawTF.concat(hisTF);
      ////console.log(dataTranform);
      await this.addDataToStore(dataTranform);

    }
    this.loadSingleValue();
    this.loadMultipleValues();
    this.initloadInverterValues();
    //console.log(this.data);
    this.startTimer(this.appLoadService.Config.Timer * 60000);
  }

  private async createRequests02()
  {
      const request: DashboardRequestModel = {
        Realtime: this.createRealtimeRequest(this.configs01),
        Historian: this.createHistorianRequest(this.configs02)
      }
      if (this.configs01) {
        const requests1 = this.createRealtimeRequest(this.configs01);
       //requests.push(requests1);
      }
      if (this.configs02) {
        const requests2 = this.createHistorianRequest(this.configs02);
        this.dashboardInverterService.requests = requests2;
        //requests.push(...requests2);
      }
      //console.log(request);
      await this.store.dispatch(new SetDashboardRequest(request)).toPromise();
  }

  private async updateRequests02()
  {    
      const requests = [];
      if (this.configs01) {
        const requests1 = this.createRealtimeRequest(this.configs01);
        requests.push(requests1);
      }
      if (this.configs02) {
        
        const singleConfig = this.store.selectSnapshot(DashboardRequestState.getRealTimeCurrentConfig());
        ////console.log(singleConfig);

        const requests2  = singleConfig.filter(x => x.RequestId.substring(0,10) === 's_inverter');
        ////console.log(requests2);

        this.dashboardInverterService.requests = requests2;
        
        requests.push(...requests2);

      }

      //await this.store.dispatch(new SetDashboardRequest(requests)).toPromise();
  }

  async timerTick() {
    
    const realtimeData = await this.requestRawData();
    const historianData = await this.requestPlotData();
    if (historianData) {
      this.dashboardInverterService.data = historianData;
    }
    //await this.addDataToStore(rawData);
    const rawTF = await this.addRealtimeDataToStore(realtimeData);
    const hisTF = await  this.addHistorianDataToStore(historianData);
    let dataTranform = rawTF.concat(hisTF);
    //console.log(dataTranform);
    await this.addDataToStore(dataTranform);

    this.loadSingleValue();
    this.loadMultipleValues();
    this.loadInverterValues();
    this.cd.markForCheck();
  }

  setActiveButton(config: DashboardConfigStateModel, comp: PeriodComponent) {
    if (config.options && config.options.runtimeConfigs && config.options.runtimeConfigs.periodName) {
      const _period = this.periods.find(x => x.name === config.options.runtimeConfigs.periodName);
      if (_period) {
        comp.selectPeriod(_period); 
      }
    }
  }
  
  initloadInverterValues() {
    if (this.dashboardInverterService.config) {
      const invs = this.dashboardInverterService.generateInverterValues();
      if (this.dashboardInverterService.config && 
        this.dashboardInverterService.config.options && 
        this.dashboardInverterService.config.options.runtimeConfigs ) {
          const config = this.dashboardInverterService.config;
          this.chartOptions[config.name] = this.dashboardChartService.getChartInverter(config.name, invs, config.options);
          this.cd.markForCheck();
        }
    }
  }
  loadInverterValues() {
    if (this.dashboardInverterService.config) {
      const invs = this.dashboardInverterService.generateInverterValues();
      if (this.dashboardInverterService.config && 
        this.dashboardInverterService.config.options && 
        this.dashboardInverterService.config.options.runtimeConfigs ) {
          const config = this.dashboardInverterService.config;
          this.chartOptions[config.name] = this.dashboardChartService.getChartInverter(config.name, invs, config.options);
          this.cd.markForCheck();
        }
    }
  }

  async getDashboardConfigs() {
    const dashboardConfigs: DashboardConfigs = await this.httpService.getConfig2('assets/dashboard/configurations/dashboard['+this.siteName.id+'].config.json');
    // const weatherConfigs: DashboardConfigs = await this.httpService.getConfig2('assets/card-weather/weather-value.json');
    //const ChartsConfigs: DashboardConfigStateModel[] = await this.httpService.getConfig('assets/dashboard/configurations/dashboard.chart.config.json');
    this.chartConfigs = [].concat(dashboardConfigs.chartConfig);
    //console.log(this.chartConfigs);
    //this.dashboardTagService.addServerName(dashboardConfigs);
    this.store.dispatch(new SetDashboardConfigs(dashboardConfigs));
    return dashboardConfigs;
  }

  // async registerTags(dashboardConfigs: any[]) {
  //   const tagNames = await this.dashboardTagService.getTagNames(dashboardConfigs);
  //   await this.store.dispatch(new AddTags(tagNames)).toPromise();
  // }

  createRealtimeRequest(config: DashboardConfigsRealtime[]){
    const request = this.dashboardRequestService.createRealtimeRequest(config);
    return request
  }

  createHistorianRequest(config: DashboardConfigsHistorian[]){
    const request = this.dashboardRequestService.createHistorianRequest(config);
    return request;
  }

  createRequests(dashboardConfigs: DashboardConfigStateModel[]) {
    const requests = this.dashboardRequestService.createRequest(dashboardConfigs);
    return requests;
  }

  createRequestsInterver(dashboardConfigs: DashboardConfigStateModel) {
    const request = this.dashboardRequestService.createInverterRequest(dashboardConfigs);
    return request;
  }

  async requestRawData(): Promise<any[]> {
    const requests = this.store.selectSnapshot(DashboardRequestState.getRequestRealtime());
    const data = await this.httpService.getRealtime(requests);
    //console.log(data)
    return data;
  }

  async requestPlotData(): Promise<any[]> {
    const requests = this.store.selectSnapshot(DashboardRequestState.getRequestHistorian());
    //console.log(requests);
    let data: DashboardResHistorian[] = await this.httpService.getHistorian(requests);
    return this.getMaxValueRecord(data);
  }

  getMaxValueRecord(data: DashboardResHistorian[]) {
    return data.map(item => {
      const maxValues = {};
      item.records.forEach(record => {
        const TimeStamp = record.TimeStamp;
        const value = parseFloat(record.Value.replace(",", ""));

        if (!maxValues[TimeStamp] || value > parseFloat(maxValues[TimeStamp].Value.replace(",",""))) {
          maxValues[TimeStamp] = {...record,Value:value.toString() };
        }
      })
      const maxRecords: Record[] = Object.values(maxValues)
      return  { ...item, records:maxRecords.filter((d, i, a) => 
          i === a.findIndex((t) => (
            t.TimeStamp === d.TimeStamp && t.Value === d.Value
          ))
        )
      }
    })
  }

  async addDataToStore(data: any[]) {
    await this.store.dispatch(new SetDashboardValues(data)).toPromise();
  }

  async addRealtimeDataToStore(data: any[]) {
    const Datas: DashboardResRealtime[] = data;
    let newData: DashboardLastValuesModel[] = []
    Datas.forEach((item) => {
      let record:DashboardLastValuesModel = {
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
    return newData;
    ////console.log(newData)
    //await this.store.dispatch(new SetDashboardValues(newData)).toPromise();
  }

  async addHistorianDataToStore(data: any[]) {
    const Datas: DashboardResHistorian[] = data;
    let newData: DashboardLastValuesModel[] = []
    Datas.forEach((item) => {
      let record:DashboardLastValuesModel = {
        Name: item.Name,
        Mode: "Historian",
        Min: item.Min,
        Max: item.Max,
        Unit: item.Unit,
        DataRecord: item.records
      }
      newData.push(record);
    });
    return newData;
    ////console.log(newData)
    //await this.store.dispatch(new SetDashboardValues(newData)).toPromise();
  }



  loadSingleValue() {
    const curr = this.dashboardLastValuesService.getCurrentGroupData();
    ////console.log(curr);
    this.data.singleValue = { ...curr };
    this.periodSelected = this.periods[0];
    this.cd.markForCheck();
  }

  loadMultipleValues() {
    const plot = this.dashboardLastValuesService.getPlotGropData1(this.chartConfigs);
    const raw = this.dashboardLastValuesService.getRawGropData1(this.chartConfigs);
    const hisData = { ...plot, ...raw };

    for (const name in hisData) {
      if (hisData.hasOwnProperty(name) && name !== 'interverEnergy') {
        const data = hisData[name];
        this.chartOptions[name] = this.dashboardChartService.getChartOptions(name, data);
      }
    }
    this.cd.markForCheck();
  }

  // emit event from view (period component)
  async selectPeriodInverter(period: Period, chartName: string) {
    //console.log("Chart: "+chartName+"\nStart :"+period.name);
    const st = this.dateTimeService.parseDate(period.name).startTime;
    const now = this.dateTimeService.getDateTime(new Date());
    await this.store.dispatch(new ChangePeriodName(period.name, chartName)).toPromise();
    const _period = this.dateTimeService.parseDate(period.name);
    const tagChart: any[] = this.store.selectSnapshot(DashboardConfigsState.getConfigwithChartName(chartName));
    await this.store.dispatch(new ChangePeriod1(tagChart, st, now, period.name)).toPromise();

    this.dashboardInverterService.periodName = period.name;
    this.dashboardInverterService.requests.forEach(r => {   
      r.Options.StartTime = st;
      r.Options.EndTime = now;
    });
    const req: DashboardReqHistorian[] = this.store.selectSnapshot(DashboardRequestState.getRequestHistorianWithName(tagChart, period));
    const res: DashboardResHistorian[] = await this.httpService.getHistorian(this.dashboardInverterService.requests);
    // console.log(req);
    // console.log(res);
    this.dashboardInverterService.data = this.getMaxValueRecord(res);
    this.loadInverterValues();
  }

  // emit event from view (period component)
  async selectPeriod(period: Period, chartName: string) {
    //console.log("Chart: "+chartName+"\nStart :"+period.name);
    await this.store.dispatch(new ChangePeriodName(period.name, chartName)).toPromise();
    const _period = this.dateTimeService.parseDate(period.name);
    const tagChart: any[] = this.store.selectSnapshot(DashboardConfigsState.getConfigwithChartName(chartName));
    await this.store.dispatch(new ChangePeriod1(tagChart, _period.startTime, _period.endTime, period.name)).toPromise();

    const req: DashboardReqHistorian[] = this.store.selectSnapshot(DashboardRequestState.getRequestHistorianWithName(tagChart, period));
    const res: DashboardResHistorian[] = await this.httpService.getHistorian(req);
    if(period.display == "12m"){
      res.map(item => {
        let rec: Record[] = [];
        if(item.Name.endsWith("MONTH")){
          rec = item.records.filter(x => x.TimeStamp.includes("31T17:00:00.000Z"));
        } else {
          rec = item.records;
        }
        return { ...item, records: rec };
      })
    }
    await this.store.dispatch(new ChangeLastValues1(tagChart, this.getMaxValueRecord(res))).toPromise();
    const charts = this.chartConfigs.find(d => d.name == chartName);
    const type = charts.type;
    let data: MultipleValue = {};
    if (type === "Raw") {
      data = this.dashboardLastValuesService.getRawGroupDataWithName(chartName, period.name, this.chartConfigs);
    }
    else if (type === "Plot") {
      data = this.dashboardLastValuesService.getPlotGroupDataWithName(chartName, period.name, this.chartConfigs);
    }
    if (data && data[chartName] && data[chartName].data.length > 0) {
      //console.log(data);
      this.chartOptions[chartName] = this.dashboardChartService.getChartOptions(chartName, data[chartName]);
    }

    this.cd.markForCheck();
  }

  startTimer(dueTimer: number) {
    const _timer = timer(dueTimer, dueTimer).subscribe(x => {
      this.timerTick();
    });
    this.subscriptions.push(_timer);
  }

  tick() {
    this.timerTick();
  }

  cancleTimer() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

 

  private cloneHisReqs(hisReqs: DashboardRequestStateModel[]): DashboardRequestStateModel[] {
    const cloneReqs: DashboardRequestStateModel[] = JSON.parse(JSON.stringify(hisReqs));
    const period = this.dateTimeService.parseDate('t');
    cloneReqs.forEach(req => {
      const st = period.startTime;
      const ed = period.endTime;
      if (period) {
        req.StartTime = st;
        req.EndTime = ed;
      }
    });
    return cloneReqs;
  }

}



