import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, HostListener } from '@angular/core';
import { Store } from '@ngxs/store';
import { Subscription, timer, Observable } from 'rxjs';
import { DashboardConfigStateModel, DashboardConfigs, DashboardConfigsHistorian, DashboardConfigsRealtime } from '../core/stores/configs/dashboard/dashboard-configs.model';
import { ChangePeriodName, DashboardConfigsState, SetDashboardConfigs } from '../core/stores/configs/dashboard/dashboard-configs.state';
import { DashboardLastValuesModel, DashboardLastValuesStateModel, DashboardResHistorian, DashboardResRealtime } from '../core/stores/last-values/dashboard/dashboard-last-values.model';
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
import { BuildingState } from '../core/stores/building/building.state';
import { MatDialog } from '@angular/material';
import { DialogbreakerComponent } from '../share/components/dialogbreaker/dialogbreaker.component';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  //@Select(BuildingState.getSites) Bx$:Observable<BuildingModel>;
  data: GroupData1 = {
    singleValue: {},
    multipleValue: {}
  };
  data02: GroupData1 = {
    singleValue: {},
    multipleValue: {}
  };
  time: Date;
  subscriptions: Subscription[] = [];
  sub1: Subscription;
  sub2: Subscription;
  chartConfigs: DashboardConfigStateModel[] = [];
  chartOptions: ChartOptions = {};
  chartChildOptions: ChartOptions = {};
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
  siteSelected: BuildingModel;
  displayCard: boolean = false;
  currentRoute: string;
  color = 'primary';
  mode = 'determinate';
  value = 30;
  value1 = 65;
  value2 = 84;
  siteName: BuildingModel = {
    no: "01",
    id: "ARC003",
    name: "อาคารเลิศ อุรัสยะนันทน์",
    capacity: 113.4,
    zone: "13028863"
  };
  diameter:number = 80;
  strokeWidth:number = 5;
  public getScreenWidth: any;
  public getScreenHeight: any;
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
    private check: NavbarComponent,
    public dialog: MatDialog) {
    this.periodSelected = this.periods[0];
    this.sub1 = this.event.triggerFunction$.subscribe(() => {
      this.updateInit();
    });
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    if(window.innerWidth > 2559){
        //////console.log(this.getScreenWidth);
        this.diameter = 120;
        this.strokeWidth = 10;
    }
    if(window.innerWidth > 3839){
        this.diameter = 180;
        this.strokeWidth = 15;
    }
    if(window.innerWidth < 1370){
      this.diameter = 180;
        this.strokeWidth = 15;
    }
  }

  ngOnInit() {
    //this.init();
    localStorage.setItem('nowUrl',this.router.url.toString());
    this.currentRoute = this.router.url.toString()
    const building = localStorage.getItem('location');
    const coBuilding = JSON.parse(building)
    if(coBuilding){
      this.siteName = coBuilding;
      this.siteSelected = coBuilding;
      this.init01();
    } else {
      alert('Please select building !');
    }
    this.onWindowResize()
  }

  updateInit(){
    this.unSubscribeTimer();
    this.displayCard = false;
    const building = localStorage.getItem('location');
    const coBuilding = JSON.parse(building);
    if(coBuilding){
      this.siteName = coBuilding;
      this.siteSelected = coBuilding;
      this.init01();
    }
    this.cd.markForCheck();
    //this.init02();
  }

  selectBuilding(id: string){
    this.displayCard = false;
    const slcBx = this.store.selectSnapshot(SitesState.getSiteWithId(id));
    if(slcBx){
      this.siteSelected = slcBx;
      this.init02();
    }
  }

  getBuildingName(id: string){
    let res: string = "";
    const slcBx:BuildingModel = this.store.selectSnapshot(SitesState.getSiteWithId(id));
    if(slcBx){
      res = slcBx.name + ' ('+ slcBx.capacity +' kWp)';
    }
    return res;
  }

  closeCard(){
    this.displayCard = false;
  }

  ngAfterViewInit() {
    
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
    this.sub1.unsubscribe();
    //this.sub2.unsubscribe();
  }

  unSubscribeTimer(){
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  
  getPeakTime(sec: number) {
    const time = new Date();
    time.setHours(0, 0, 0, 0);
    time.setSeconds(sec);
    const timeStr = "xxx";//this.datePipe.transform(time, 'HH:mm');
    this.cd.markForCheck();
    return timeStr;
  }

  configs01: DashboardConfigsRealtime[];
  configs02: DashboardConfigsHistorian[];

  private async init02()
  {
    const dashboardConfigs = await this.getDashboardConfigs02();
    //////console.log(dashboardConfigs);
    this.configs01 = dashboardConfigs.realtimeConfig;
    this.configs02 = dashboardConfigs.historianConfig;
    this.dashboardInverterService.config = dashboardConfigs.chartConfig.find(c => c.name === "interverEnergy");
    this.displayCard = true;
    await this.createRequests02();
  
    const realtimeData = await this.requestRawData();
    const historianData = await this.requestPlotData();
    if (historianData) {
      this.dashboardInverterService.data = historianData;
    }
    //await this.addDataToStore(rawData);
    const rawTF = await this.addRealtimeDataToStore(realtimeData);
    const hisTF = await  this.addHistorianDataToStore(historianData);
    let dataTranform = rawTF.concat(hisTF);
    //////console.log(dataTranform);
    await this.addDataToStore(dataTranform);

    this.loadSingleValue02();
    
    this.loadMultipleValues();
    //this.initloadInverterValues();
    //this.startTimer(this.appLoadService.Config.Timer * 60000);
    if(this.chartOptions != null){
      this.chartChildOptions = this.chartOptions;
    }
    ////console.log(this.data);
    this.cd.markForCheck()
  }

  private async init01()
  {
    const dashboardConfigs = await this.getDashboardConfigs();
    //////console.log(dashboardConfigs);
    this.configs01 = dashboardConfigs.realtimeConfig;
    this.configs02 = dashboardConfigs.historianConfig;
    this.dashboardInverterService.config = dashboardConfigs.chartConfig.find(c => c.name === "interverEnergy");

    await this.createRequests02();
  
    const realtimeData = await this.requestRawData();
    const historianData = await this.requestPlotData();
    if (historianData) {
      this.dashboardInverterService.data = historianData;
    }
    //await this.addDataToStore(rawData);
    const rawTF = await this.addRealtimeDataToStore(realtimeData);
    const hisTF = await  this.addHistorianDataToStore(historianData);
    let dataTranform = rawTF.concat(hisTF);
    //////console.log(dataTranform);
    await this.addDataToStore(dataTranform);

    this.loadSingleValue();
    this.loadMultipleValues();
    this.initloadInverterValues();
    this.startTimer(this.appLoadService.Config.Timer * 60000);
    if(this.chartOptions != null){
      this.chartChildOptions = this.chartOptions;
    }
    //console.log(this.data);
    this.cd.markForCheck()
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
      //////console.log(request);
      await this.store.dispatch(new SetDashboardRequest(request)).toPromise();
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
    //////console.log(dataTranform);
    await this.addDataToStore(dataTranform);

    this.loadSingleValue();
    this.loadMultipleValues();
    this.loadInverterValues();
    if(this.chartOptions != null){
      this.chartChildOptions = this.chartOptions;
    }
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
    const dashboardConfigs: DashboardConfigs = await this.httpService.getConfig2('assets/building/configurations/building['+this.siteSelected.zone+'].config.json');
    this.store.dispatch(new SetDashboardConfigs(dashboardConfigs));
    return dashboardConfigs;
  }

  async getDashboardConfigs02() {
    const dashboardConfigs: DashboardConfigs = await this.httpService.getConfig2('assets/building/configurations/building['+this.siteSelected.id+'].config.json');
    this.store.dispatch(new SetDashboardConfigs(dashboardConfigs));
    return dashboardConfigs;
  }

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
    return data;
  }

  async requestPlotData(): Promise<any[]> {
    const requests = this.store.selectSnapshot(DashboardRequestState.getRequestHistorian());
    const data: DashboardResHistorian[] = await this.httpService.getHistorian(requests);
    return data;
  }

  getMaxValueRecord(data: DashboardResHistorian[]) {
    return data.map(item => {
      const maxValues = {};
      item.records.forEach(record => {
        const TimeStamp = record.TimeStamp;
        const value = parseFloat(record.Value);

        if (!maxValues[TimeStamp] || value > parseFloat(maxValues[TimeStamp].Value)) {
          maxValues[TimeStamp] = {...record,Value:value };
        }
      });
      const maxRecords = Object.values(maxValues)
      return  {...item, records:maxRecords}
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
  }

  async addHistorianDataToStore(data: any[]) {
    const Datas: DashboardResHistorian[] = data;
    let newData: DashboardLastValuesModel[] = []
    Datas.forEach((item) => {
      let record:DashboardLastValuesModel = {
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
  }



  loadSingleValue() {
    const curr = this.dashboardLastValuesService.getCurrentGroupData();
    //////console.log(curr);
    this.data.singleValue = { ...curr };
    this.cd.markForCheck();
  }

  loadSingleValue02() {
    const curr = this.dashboardLastValuesService.getCurrentGroupData();
    //////console.log(curr);
    this.data02.singleValue = { ...curr };
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

  getSaving(dt: string){
    const value = parseFloat(dt);
    if(value){
      return (value*2.7).toFixed(2);
    } else {
      return "0";
    }
  }

  getSumValue(key: string){
    const data = Object.entries(this.data02.singleValue)
    .filter(x => x[0].includes(key))
      .map(d => parseFloat(d[1].dataRecords[0].Value))
        .reduce((pre, cur) => { pre += cur; return pre; }, 0);
    if(data){
      return data.toFixed(2);
    } else {
      return 0;
    }
  }

  getAverageValue(key: string){
    const data = Object.entries(this.data02.singleValue)
    .filter(x => x[0].includes(key))
      .map(d => parseFloat(d[1].dataRecords[0].Value))
        .reduce((pre, cur, idx, arr) => { pre += (cur/arr.length); return pre; }, 0);
    if(data){
      return data.toFixed(2);
    } else {
      return 0;
    }
  }

  openBreaker() {
    const dialogRef = this.dialog.open(DialogbreakerComponent, {
      width: '650px',
      data: this.siteSelected,
      backdropClass: 'dialog-backdrop',
      panelClass: ['dialog-panel']
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

}
