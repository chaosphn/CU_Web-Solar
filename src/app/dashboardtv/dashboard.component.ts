import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, HostListener, ElementRef, Renderer2 } from '@angular/core';
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
import {debounceTime, filter } from 'rxjs/operators';
import { Router,NavigationEnd  } from '@angular/router';
import { LocalStorageService } from '../share/services/localstorage.service';
import { EventService } from '../share/services/event.service';
import { NavbarComponent } from '../core/components/navbar/navbar.component';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss','./dashboard.component-effect.scss','./dashboard.component-effect1.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  @Select(SitesState.getSites) sites$:Observable<SiteStateModel[]>;
  data?: GroupData1 = {
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
  color:string = 'primary';
  mode:string = 'determinate';
  diameter:number = 0;
  stroke:number = 0;
  value:number = 0;
  value1:number = 0;
  value2:number = 0;
  siteName: string = '';
  isFullmap: boolean = true;
  public getScreenWidth: any;
  public getScreenHeight: any;
  buildingList: BuildingModel[] = [];
  displayedColumns: string[] = ['No', 'Building', 'Power', 'Energy'];
  dataSource: MatTableDataSource<any>

  @ViewChild('progressBar') progressBar: ElementRef;

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
    private renderer: Renderer2,
    private changeDetectorRefs: ChangeDetectorRef,
    private event: EventService) {
    this.periodSelected = this.periods[0];
  }
  

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    if(window.innerWidth > 2559){
        ////console.log(this.getScreenWidth);
        this.diameter = 180;
        this.stroke = 30;
    }
  }

  async ngOnInit() {
    //this.init();
    localStorage.setItem('nowUrl',this.router.url.toString());
    const building: SiteStateModel = await this.httpService.getNavConfig('assets/main/BuildingList.json');
    if(building && building.building){
      this.buildingList = building.building.filter(x => !x.building).sort((a,b) => parseInt(a.no) - parseInt(b.no));
    }
    await this.init02();
    await this.getConfig();
    this.onWindowResize();
    // //console.log(this.data.singleValue)
  }

  async getConfig() {
    //this.siteList = await this.httpService.getConfig('assets/main/location.json');
    //this.buildingList = await this.httpService.getNavConfig('assets/main/BuildingList.json');
    const dashboardConfigs: DashboardConfigs = await this.httpService.getConfig2('assets/dashboard/configurations/dashboard[CEN091].config.json');
    
    // this.dataSource = await new MatTableDataSource(this.getTabel());
    // this.dataSource.paginator = this.paginator;
    // //console.log(this.buildingList.building);
  }

  isChange(){
    //this.event.changeNavbar();
    //this.router.navigate(['/main/dashboard1']);
    this.isFullmap = !this.isFullmap;
  }

  isShow(id){
    const nowLocation = localStorage.getItem('location')
    const tuneLocation = JSON.parse(nowLocation)
    localStorage.setItem('location','{"id":"'+tuneLocation.id+'","zone":"'+id+'","name":"'+tuneLocation.name+'","capacity":'+tuneLocation.capacity+'}');
    localStorage.setItem('zone', id)
    this.event.changeNavbar();
    this.router.navigate(['/main/dashboard2']);
  }

  navigateToDashboard(item: BuildingModel){
    localStorage.setItem('location', JSON.stringify(item));
    this.event.changeNavbar();
    this.router.navigate(['/main/dashboard']);
  }

  updateZone(){
    const siteName = localStorage.getItem('location');
    const parseZone = JSON.parse(siteName)
    const zone = parseZone.zone;
    localStorage.setItem('zone','zone'+zone)
  }
  selectedZone(){
    const zoneID = localStorage.getItem('zone')
    return zoneID;
  }

  modeFullmap(){
    this.isFullmap = !this.isFullmap
  }

  getLabel(txt:string ,st:number, en:number){
    const res = txt.substring(st, en);
    return res;
  }


  updateInit(){
    this.siteName = localStorage.getItem('location');
    ////console.log("Update Dashboard Component in site:"+ this.siteName);
    //this.init02();
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.paginator.page.subscribe((event) =>{
    //   // //console.log(this.dataSource)
    // })
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
    //this.sub1.unsubscribe();
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  

  getTabel(){
    let showlist = [0,4,5,6,7,8]
      return this.buildingList.filter((item,index) => showlist.includes(index))
      .map((item, index) => {
        const powerData = this.data.singleValue[item.id + '_power'];
        const energyData = this.data.singleValue[item.id + '_energy'];
        return {
          no: index + 1,
          building: item.id,
          power: powerData && powerData.dataRecords && powerData.dataRecords.length > 0 ? powerData.dataRecords[0].Value : 0,
          energy: energyData && energyData.dataRecords && energyData.dataRecords.length > 0 ? energyData.dataRecords[0].Value : 0
        };
      });
    }

  increaseValue(){
    //this.event.changeNavbar();
    this.router.navigate(['/main/dashboard1']);
    // this.value = this.value + 100;
    ////console.log(this.value)
  }

  hoverEffect(id: string){
    switch(id){
      case "card1":
        const element1 = Array.from(document.querySelectorAll('#img-card1'));
        //////console.log(elements);
        element1.forEach((item) => {
          item.classList.add('scale-in-ver-bottom');
        });
        break;
      case "card2":
        const element2 = Array.from(document.querySelectorAll('#img-card2'));
        //////console.log(element2);
        element2.forEach((item) => {
          item.classList.add('scale-in-ver-bottom');
        });
        break;
      case "card3":
        const element3 = Array.from(document.querySelectorAll('#img-card3'));
        //////console.log(element3);
        element3.forEach((item) => {
          item.classList.add('scale-in-ver-bottom');
        });
        break;
      case "card4":
        const element4 = Array.from(document.querySelectorAll('#img-card4'));
        //////console.log(element4);
        element4.forEach((item) => {
          item.classList.add('scale-in-ver-bottom');
        });
        break;
      case "card5":
        const element5 = Array.from(document.querySelectorAll('#img-card5'));
        //////console.log(element5);
        element5.forEach((item) => {
          item.classList.add('scale-in-ver-bottom');
        });
        break;
      case "card6":
        const element6 = Array.from(document.querySelectorAll('#img-card6'));
        //////console.log(element6);
        element6.forEach((item) => {
          item.classList.add('scale-in-ver-bottom');
        });
        break;
      case "card7":
        const element7 = Array.from(document.querySelectorAll('#img-card7'));
        //////console.log(element7);
        element7.forEach((item) => {
          item.classList.add('scale-in-ver-bottom');
        });
        break;
      default:
        break;
    }
  }
  removeEffect(id: string){
    switch(id){
      case "card1":
        const element1 = Array.from(document.querySelectorAll('#img-card1'));
        //////console.log(elements);
        element1.forEach((item) => {
          item.classList.remove('scale-in-ver-bottom');
        });
        break;
      case "card2":
        const element2 = Array.from(document.querySelectorAll('#img-card2'));
        //////console.log(element2);
        element2.forEach((item) => {
          item.classList.remove('scale-in-ver-bottom');
        });
        break;
      case "card3":
        const element3 = Array.from(document.querySelectorAll('#img-card3'));
        //////console.log(element3);
        element3.forEach((item) => {
          item.classList.remove('scale-in-ver-bottom');
        });
        break;
      case "card4":
        const element4 = Array.from(document.querySelectorAll('#img-card4'));
        //////console.log(element4);
        element4.forEach((item) => {
          item.classList.remove('scale-in-ver-bottom');
        });
        break;
      case "card5":
        const element5 = Array.from(document.querySelectorAll('#img-card5'));
        //////console.log(element5);
        element5.forEach((item) => {
          item.classList.remove('scale-in-ver-bottom');
        });
        break;
      case "card6":
        const element6 = Array.from(document.querySelectorAll('#img-card6'));
        //////console.log(element6);
        element6.forEach((item) => {
          item.classList.remove('scale-in-ver-bottom');
        });
        break;
      case "card7":
        const element7 = Array.from(document.querySelectorAll('#img-card7'));
        //////console.log(element7);
        element7.forEach((item) => {
          item.classList.remove('scale-in-ver-bottom');
        });
        break;
      default:
        break;
    }
  }
  
  addAllEffect(){
    const element1 = Array.from(document.querySelectorAll('.effect'));
    //////console.log(elements);
    element1.forEach((item) => {
      item.classList.add('scale-in-ver-bottom');
    });
    setTimeout(() =>{
      this.removeAllEffect(element1);
    },1500);
  }

  removeAllEffect(element: any){
    element.forEach(item => {
      item.classList.remove('scale-in-ver-bottom');
    })
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
    ////console.log("Init Page");
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
        this.dashboardInverterService.data = historianData;
      }
      //await this.addDataToStore(rawData);
      const rawTF = await this.addRealtimeDataToStore(realtimeData);
      const hisTF = await  this.addHistorianDataToStore(historianData);
      let dataTranform = rawTF.concat(hisTF);
      //////console.log(dataTranform);
      await this.addDataToStore(dataTranform);

    }
    this.loadSingleValue();
    this.loadMultipleValues();
    this.initloadInverterValues();
    // //console.log(this.data.singleValue['CEN091_energy'].dataRecords[0].Value);
    this.updateZone();
    this.startTimer(this.appLoadService.Config.Timer * 60000);
    // //console.log(this.data)
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
      ////console.log(request);
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
        //////console.log(singleConfig);

        const requests2  = singleConfig.filter(x => x.RequestId.substring(0,10) === 's_inverter');
        //////console.log(requests2);

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
    ////console.log(dataTranform);
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
    const dashboardConfigs: DashboardConfigs = await this.httpService.getConfig2('assets/map-overview/configurations/dashboard.map.config.json');
    //const ChartsConfigs: DashboardConfigStateModel[] = await this.httpService.getConfig('assets/dashboard/configurations/dashboard.chart.config.json');
    this.chartConfigs = [].concat(dashboardConfigs.chartConfig);
    ////console.log(this.chartConfigs);
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
    return data;
  }

  async requestPlotData(): Promise<any[]> {
    const requests = this.store.selectSnapshot(DashboardRequestState.getRequestHistorian());
    const data = await this.httpService.getHistorian(requests);
    return data;
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
    //////console.log(newData)
    //await this.store.dispatch(new SetDashboardValues(newData)).toPromise();
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
    //////console.log(newData)
    //await this.store.dispatch(new SetDashboardValues(newData)).toPromise();
  }

  loadSingleValue() {
    const curr = this.dashboardLastValuesService.getCurrentGroupData();
    // //console.log(curr);
    this.data.singleValue = { ...curr };
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
    ////console.log("Chart: "+chartName+"\nStart :"+period.name);
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
    const req: DashboardReqHistorian[] = this.store.selectSnapshot(DashboardRequestState.getRequestHistorianWithName(tagChart, _period));
    const res: DashboardResHistorian[] = await this.httpService.getHistorian(req);
    ////console.log(res);
    this.dashboardInverterService.data = res;
    this.loadInverterValues();
  }

  // emit event from view (period component)
  async selectPeriod(period: Period, chartName: string) {
    ////console.log("Chart: "+chartName+"\nStart :"+period.name);
    await this.store.dispatch(new ChangePeriodName(period.name, chartName)).toPromise();
    const _period = this.dateTimeService.parseDate(period.name);
    const tagChart: any[] = this.store.selectSnapshot(DashboardConfigsState.getConfigwithChartName(chartName));
    await this.store.dispatch(new ChangePeriod1(tagChart, _period.startTime, _period.endTime, period.name)).toPromise();

    const req: DashboardReqHistorian[] = this.store.selectSnapshot(DashboardRequestState.getRequestHistorianWithName(tagChart, _period));
    const res: DashboardResHistorian[] = await this.httpService.getHistorian(req);
    ////console.log(res);
    await this.store.dispatch(new ChangeLastValues1(tagChart, res)).toPromise();
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
      ////console.log(data);
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

  getSumValue(key: string){
    const data = Object.entries(this.data.singleValue)
    .filter(x => x[0].endsWith(key))
      .map(d => parseFloat(d[1].dataRecords[0].Value))
        .reduce((pre, cur) => { pre += cur; return pre; }, 0);
    if(data){
      return data.toFixed(2);
    } else {
      return 0;
    }
  }

  getAverageValue(key: string){
    const data = Object.entries(this.data.singleValue)
    .filter(x => x[0].endsWith(key))
      .map(d => parseFloat(d[1].dataRecords[0].Value))
        .reduce((pre, cur, idx, arr) => { pre += (cur/arr.length); return pre; }, 0);
    if(data){
      return data.toFixed(2);
    } else {
      return 0;
    }
  }


}


export interface DataModel{
  buiding:string;
  power:string; 
  energy:string;
}