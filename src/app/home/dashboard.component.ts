import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { Subscription, timer, Observable } from 'rxjs';
import { DashboardConfigStateModel, DashboardConfigs, DashboardConfigsHistorian, DashboardConfigsRealtime, Options } from '../core/stores/configs/dashboard/dashboard-configs.model';
import { ChangePeriodName, DashboardConfigsState, SetDashboardConfigs } from '../core/stores/configs/dashboard/dashboard-configs.state';
import { DashboardLastValuesModel, DashboardLastValuesStateModel, DashboardResHistorian, DashboardResRealtime, Record } from '../core/stores/last-values/dashboard/dashboard-last-values.model';
import { ChangeLastValues, ChangeLastValues1, DashboardLastValuesState, SetDashboardValues } from '../core/stores/last-values/dashboard/dashboard-last-values.state';
import { DashboardReqHistorian, DashboardRequestModel, DashboardRequestStateModel } from '../core/stores/requests/dashboard/dashboard-request.model';
import { ChangePeriod, ChangePeriod1, ChangePeriod2, ChangeTagIds, SetDashboardRequest } from '../core/stores/requests/dashboard/dashboard-request.state';
import { AddTags } from '../core/stores/tags/tags.state';
import { ChartOptions } from '../share/models/chart-options.model';
import { Period } from '../share/models/period';
import { AppLoadService } from '../share/services/app-load.service';
import { DashboardRequestState } from '../core/stores/requests/dashboard/dashboard-request.state';
import { PeriodComponent } from '../share/components/period/period.component';
import { GroupData1, MultipleValue, GroupData } from '../share/models/value-models/group-data.model';
import { ValueType } from '../share/models/value-models/value-type.model';
import { DateTimeService } from '../share/services/datetime.service';
import { HttpService } from '../share/services/http.service';
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
import { Timestamp } from 'rxjs/internal/operators/timestamp';
import { PeriodGroup, PeriodTime, PeriodTime1 } from '../share/models/period-time';
import { LocationStateModel } from '../core/stores/location/location.model';
import { AddZone, LocationState } from '../core/stores/location/location.state';

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
  dateTime1: Date = new Date();
  dateTime2: Date = new Date();
  dateTime3: Date = new Date();
  dateTime4: Date = new Date();
  subscriptions: Subscription[] = [];
  sub1: Subscription;
  sliderTimer: Subscription;
  locationState$: Observable<LocationStateModel> = this.store.select(LocationState.getLocation());
  locationSub: Subscription;
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
  periodGroup:PeriodGroup[] = [
    { Name: 'D', Type: 'daily' }, { Name: 'W', Type: 'weekly' }, { Name: 'M', Type: 'monthly' }, { Name: 'Y', Type: 'yearly' },
  ];
  periodGroupSelected1: PeriodGroup;
  periodGroupSelected2: PeriodGroup;
  periodGroupSelected3: PeriodGroup;
  periodGroupSelected4: PeriodGroup;
  siteSelected: SiteStateModel[];
  currentRoute: string;
  isInitialized:boolean = false;
  siteName: BuildingModel;
  buildingList: BuildingModel[] = [];
  dataRealtime?: DashboardResRealtime[] = [];
  dataHistorian?: DashboardResHistorian[] = []
  disableButton: boolean = false;
  chartSelected?: string;
  locationConfig: LocationStateModel[] = [];
  locationSelected: LocationStateModel = {
    zone: 'overall',
    meters: [],
    buildings: []
  };
  zoneScrolled: string = "all";

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
      //this.updateInit();
    });
  }

  async ngOnInit() {
    //this.init();
    localStorage.setItem('nowUrl',this.router.url.toString());
    this.currentRoute = this.router.url.toString()
    const building = localStorage.getItem('location');
    this.siteName = JSON.parse(building);
    //this.initDateTime();
    await this.getLocationConfigs();
    //this.init02();
    this.locationSub = this.locationState$.subscribe((data) => {
      //console.log('update state : '+ data.zone);
      this.unSubscribeTimer();
      if(data && data.zone){
        this.locationSelected = data;
        this.init02();
      } else {
        this.locationSelected = this.locationConfig[0];
        this.init02();
      }
      //this.cd.markForCheck();
    });
    this.locationSliderTimer();
  }

  async updateLocation(name: string){
    const zone = this.locationConfig.find(x => x.zone == name);
    if(zone){
      await this.store.dispatch(new AddZone(zone)).toPromise();
    }
  }

  locationSliderTimer(){
    this.sliderTimer = timer(300000, 300000).subscribe(x => {
      const index = this.locationConfig.findIndex(x => x.zone == this.locationSelected.zone);
      if(index == this.locationConfig.length-1){
        this.updateLocation(this.locationConfig[0].zone);
      } else {
        this.updateLocation(this.locationConfig[index+1].zone);
      }
    });
  }

  async getLocationConfigs() {
    const location: LocationStateModel[] = await this.httpService.getConfig('assets/main/location.json');
    if(location){
      //console.log(location)
      this.locationConfig = location;
      this.locationSelected = location[0];
    }
    const building: SiteStateModel = await this.httpService.getNavConfig('assets/main/BuildingList.json');
    if(building && building.building){
      this.buildingList = building.building.filter(x => !x.building).sort((a,b) => parseInt(a.no) - parseInt(b.no));
    }
  }


  updateInit(){
    this.unSubscribeTimer();
    //this.initDateTime();
    this.init02();
    this.cd.markForCheck();
  }

  ngAfterViewInit() {
    this.isInitialized = true;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
    this.sub1.unsubscribe();
    this.sliderTimer.unsubscribe();
    this.locationSub.unsubscribe();
    
  }

  unSubscribeTimer(){
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  navigateToDashboard(){
    this.router.navigate(['/main/overview']);
  }
  

  
  getPeakTime(sec: number) {
    const time = new Date();
    const timeISO = time.toISOString().split('.')[0];
    time.setHours(0, 0, 0, 0);
    if(sec > 0){
      const timeStamp = new Date(time).getTime() + ((sec/3600)*60*60*1000);
      const timeStr = this.datePipe.transform(this.dateTimeService.getDateTime(new Date(timeStamp)).split('.')[0],'HH:mm');
      this.cd.markForCheck();
      return timeStr;
    } else {
      this.cd.markForCheck();
      return "---";
    }
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
    this.startTimer(this.appLoadService.Config.Timer * 12000);
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
    //console.log('update inv')
    if (this.dashboardInverterService.config) {
      const invs = this.dashboardInverterService.generateInverterValues();
      //console.log(invs)
      if (this.dashboardInverterService.config && 
        this.dashboardInverterService.config.options && 
        this.dashboardInverterService.config.options.runtimeConfigs ) {
          const config = this.dashboardInverterService.config;
          this.chartOptions[config.name] = this.dashboardChartService.getChartInverter(config.name, invs, config.options);
          this.chartSelected = undefined;
          this.disableButton = false;
          //console.log(this.chartOptions[config.name])
          this.cd.markForCheck();
        }
    }
  }

  async getDashboardConfigs() {
    const dashboardConfigs: DashboardConfigs = await this.httpService.getConfig2('assets/map-overview/configurations/dashboard.'+this.locationSelected.zone+'.config.json');
    //const ChartsConfigs: DashboardConfigStateModel[] = await this.httpService.getConfig('assets/dashboard/configurations/dashboard.chart.config.json');
    this.chartConfigs = [].concat(dashboardConfigs.chartConfig);
    //console.log(this.chartConfigs);
    //this.dashboardTagService.addServerName(dashboardConfigs);
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
    //console.log(data)
    return data;
  }

  async requestPlotData(): Promise<any[]> {
    const requests = this.store.selectSnapshot(DashboardRequestState.getRequestHistorian());
    //console.log(requests);
    let data: DashboardResHistorian[] = await this.httpService.getHistorian(requests);
    return this.getMaxValueRecord(data);
  }

  getMaxValueRecord(data: DashboardResHistorian[]): DashboardResHistorian[] {
    return data && data.length > 0 ? data.map(item => {
      const maxValues: { [key: string]: Record } = {};
  
      item.records.forEach(record => {
        const TimeStamp = record.TimeStamp;
        const value = parseFloat(record.Value);
  
        if (!maxValues[TimeStamp] || value > parseFloat(maxValues[TimeStamp].Value)) {
          maxValues[TimeStamp] = { ...record, Value: value.toString() };
        } else if (value === parseFloat(maxValues[TimeStamp].Value)) {
          // Additional criteria for handling ties can be added here
          // For now, keeping the first encountered record
        }
      });
  
      const maxRecords: Record[] = Object.values(maxValues);
      let rec: Record[] = [];
      return {
        ...item,
        records: maxRecords.reduce((acc, cur) => {
          if(acc.find(x => x.TimeStamp == cur.TimeStamp && x.Value == cur.Value )){}else if(parseFloat(cur.Value) > 0){
            acc.push(cur);
          }
          return acc;
        },rec)
      };
    }) : data;
  }
  

  async addDataToStore(data: any[]) {
    await this.store.dispatch(new SetDashboardValues(data)).toPromise();
  }

  async addRealtimeDataToStore(data: any[]) {
    const Datas: DashboardResRealtime[] = data;
    let newData: DashboardLastValuesModel[] = []
    if(Datas){
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
    }
    return newData;
    ////console.log(newData)
    //await this.store.dispatch(new SetDashboardValues(newData)).toPromise();
  }

  async addHistorianDataToStore(data: any[]) {
    const Datas: DashboardResHistorian[] = data;
    return Datas ? Datas.map(function(x){
      return {
        Name: x.Name,
        Mode: "Historian",
        Min: x.Min,
        Max: x.Max,
        Unit: x.Unit,
        DataRecord: x.records
      }
    }) : [];
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

  checkPRValue(val: string){
    const value = parseFloat(val);
    if(value > 100){
      return '100';
    } else {
      return val;
    }
  }
 

  getStartView(type: string) {
    if (type === 'daily') {
      return null;
    }
    else if(type === 'weekly') {
      return undefined;
    }
    else if(type === 'monthly') {
      return 'year';
    }
    else if(type === 'yearly') {
      return 'multi-years';
    }
  } 

  getPeriodView(type: string) {
    if (type === 'daily') {
      return {name: 't', display: 't'};
    }
    else if(type === 'weekly') {
      return {name: '7d', display: '7d'};
    }
    else if(type === 'monthly') {
      return {name: '7d', display: '7d'};
    }
    else if(type === 'yearly') {
      return {name: '12m', display: '12m'};
    }
  } 

  getZoneScroll(s: any){
    //console.log(s)
    this.zoneScrolled = s;
  }

}



