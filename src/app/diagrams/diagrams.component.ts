import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Subscription, timer, Observable, Subject } from 'rxjs';
import { DiagramConfigStateModel } from '../core/stores/configs/diagram/diagram-config.model';
import { DiagramLastValuesModel, DiagramLastValuesStateModel, DiagramResRealtime } from '../core/stores/last-values/diagram/diagram-last-values.model';
import { ChangeDiagramLastValues, SetDiagramValues } from '../core/stores/last-values/diagram/diagram-last-values.state';
import { DiagramRequestStateModel } from '../core/stores/requests/diagram/diagram-request.model';
import { DiagramRequestState, SetDiagramRequest } from '../core/stores/requests/diagram/diagram-request.state';
import { AddTags } from '../core/stores/tags/tags.state';
import { MockDataService } from '../dashboard/services/mock-data.service';
import { DiagramConfig, DiagramConfigModel, DiagramEquipmentModel } from '../share/models/diagram-config.model';
import { GroupData, GroupData1 } from '../share/models/value-models/group-data.model';
import { ValueType } from '../share/models/value-models/value-type.model';
import { AppLoadService } from '../share/services/app-load.service';
import { SetDiagramConfigs } from './../core/stores/configs/diagram/diagram-config.state';
import { DiagramLastValuesState } from './../core/stores/last-values/diagram/diagram-last-values.state';
import { HttpService } from './../share/services/http.service';
import { DiagramLastValuesService } from './services/diagram-last-values.service';
import { DiagramRequestService } from './services/diagram-request.service';
import { DigramTagService } from './services/diagram-tag.service';
import { MatDialog } from '@angular/material/dialog';
import { retry, single } from 'rxjs/operators';
import { BuildingModel, SiteStateModel } from '../core/stores/sites/sites.model';
import { SitesState } from '../core/stores/sites/sites.state';
import { Select } from '@ngxs/store';
import {debounceTime, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EventService } from '../share/services/event.service';
import { transform } from 'html2canvas/dist/types/css/property-descriptors/transform';


@Component({
  selector: 'app-diagram',
  templateUrl: './diagrams.component.html',
  styleUrls: ['./diagrams.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiagramsComponent implements OnInit, OnDestroy {
  //@Select(SitesState.getSites) sites$:Observable<SiteStateModel[]>;
  firetxt:string = "NORMAL";
  color: string = "red";
  diagrams: any;
  subscriptions: Subscription[] = [];
  data: GroupData1 = {
    singleValue: {}
  };
  siteSelected: SiteStateModel[];
  currentRoute: string;
  newName: string = ''; 
  siteName: BuildingModel;
  value = '8846546';
  templateContent: string = '';
  testStatus: boolean = false;
  equipmentList: DiagramEquipmentModel[] = [];
  sub1: Subscription;
  invAlarmConfig: InverterAlarmModel[] = [];
  private unsubscribe$: Subject<void> = new Subject();

  constructor(
    public dialog: MatDialog,
    private httpService: HttpService,
    private digramTagService: DigramTagService,
    private appLoadService: AppLoadService,
    private diagramLastValuesService: DiagramLastValuesService,
    private diagramRequestService: DiagramRequestService,
    private cd: ChangeDetectorRef,
    private mockDataService: MockDataService,
    private store: Store,
    private router: Router,
    private http: HttpClient,
    private event: EventService,) { 
      this.sub1 = this.event.triggerFunction$.subscribe(() => {
        this.updateInit();
      });
  }


  
  ngOnInit() {
    
    localStorage.setItem('nowUrl',this.router.url.toString());
    this.currentRoute = this.router.url.toString()
    const building = localStorage.getItem('location');
    this.siteName = JSON.parse(building);
    // if(this.siteName){
    //   this.init();
    // }
    this.init();
  }

  async updateInit(){
    this.unSubscribeTimer();
    const building = localStorage.getItem('location');
    this.siteName = JSON.parse(building);
    //console.log(JSON.parse(building))
    this.init();
    this.cd.markForCheck();
  }

  unSubscribeTimer(){
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  
  getAlm(tagName: string){
    let isAlarm = false;
    var value : string;
    if (this.data && this.data.singleValue[tagName]) {
      value = this.data.singleValue[tagName].dataRecords[0].Value
      isAlarm = value.toString() == 'True'
    }
    //console.log(isAlarm)
    if (isAlarm){
      return { fill:'red',opacity: 1, animation: 'blinker 2s linear infinite'}
    }else{
      return { fill:'lime',opacity: 1}
    }
  }

  getAlmRun(tagName: string){
    let isAlarm = false;
    var value : string;
    if (this.data && this.data.singleValue[tagName]) {
      value = this.data.singleValue[tagName].dataRecords[0].Value
      isAlarm = value.toString() == '1'
    }
    //, animation: 'blinker 2s linear infinite'
    if (!isAlarm){
      return { fill:'black',opacity: 1}
    }else{
      return { fill:'#00c300', opacity: 1}
    }
  }

  getFireTxt(tagName){
    let isAlarm = false;
    var value : string;
    if (this.data && this.data.singleValue[tagName]) {
      value = this.data.singleValue[tagName].dataRecords[0].Value
      //console.log(value)
      isAlarm = value.toString() == 'true'
    }
    if (isAlarm){
      return 'ALARM'
    }else{
      return 'NORMAL'
    }
  }

  getRunTxt(tagName: string){
    let isAlarm = false;
    var value : string;
    if (this.data && this.data.singleValue[tagName]) {
      value = this.data.singleValue[tagName].dataRecords[0].Value
      isAlarm = value.toString() == '1';
    }
    if (isAlarm){
      return '  RUN'
    }else{
      return ' STOP'
    }
  }

  getStatusStyle(tagName: string){
    let run: any;
    if(this.data && this.data.singleValue[tagName+'_run']){
      run = this.data.singleValue[tagName+'_run'].dataRecords[0].Value;
    }
    let alarm: any;
    if(this.data && this.data.singleValue[tagName+'_alarm']){
      alarm = this.data.singleValue[tagName+'_alarm'].dataRecords[0].Value;
    }
    if(alarm && parseInt(alarm) > 0){
      const findAlarm = this.invAlarmConfig.find(x => x.id == parseInt(alarm));
      let style: any;
      if(findAlarm){
        switch (findAlarm.level) {
          case 'Major':
            style = { fill:'red',opacity: 1, animation: 'blinker 4s linear infinite'}
            break;
          case 'Minor':
            style = { fill:'#df6400',opacity: 1, animation: 'blinker 4s linear infinite'}
            break;
          case 'Warning':
            style = { fill:'#A77800',opacity: 1, animation: 'blinker 4s linear infinite'}
            break;
          default:
            break;
        }
      }
      return findAlarm ? style : { fill:'black',opacity: 1};
    } else if(run) {
      return run && parseInt(run) == 1 ? { fill:'#00c300', opacity: 1} : { fill:'black',opacity: 1};
    } else {
      return { fill:'black',opacity: 1};
    }
  }

  getStatusTxt(tagName: string){
    let run: any;
    if(this.data && this.data.singleValue[tagName+'_run']){
      run = this.data.singleValue[tagName+'_run'].dataRecords[0].Value;
    }
    let alarm: any;
    if(this.data && this.data.singleValue[tagName+'_alarm']){
      alarm = this.data.singleValue[tagName+'_alarm'].dataRecords[0].Value;
    }
    if(alarm && parseInt(alarm) > 0){
      const findAlarm = this.invAlarmConfig.find(x => x.id == parseInt(alarm));
      return findAlarm ? findAlarm.name : 'UNKNOW';
    } else if(run) {
      return run && parseInt(run) == 1 ? 'RUNNING' : 'STOPPED';
    } else {
      return 'UNKNOW';
    }
  }

  getComTxt(tagName: string){
    let isAlarm = false;
    var value : string;
    if (this.data && this.data.singleValue[tagName]) {
      value = this.data.singleValue[tagName].dataRecords[0].Value
      isAlarm = value.toString() == 'true'
    }
    if (isAlarm){
      return 'FAIL'
    }else{
      return 'OK'
    }
  }

  getAlmTxt(tagName: string){

  }

  getAlmTxt2(tagName: string){
    let isAlarm = false;
    var value : string;
    if (this.data && this.data.singleValue[tagName]) {
      value = this.data.singleValue[tagName].dataRecords[0].Value
      //console.log(value)
      isAlarm = value.toString() == 'true'
    }
    if (isAlarm){
      return 'FAULT'
    }else{
      return 'NORMAL'
    }
    
  }

  getVisible(tagName: string){
    let isAlarm = false;
    var value : string;
    if (this.data && this.data.singleValue[tagName]) {
      value = this.data.singleValue[tagName].dataRecords[0].Value
      //console.log(value)
      isAlarm = value.toString() == 'true'
    }
    if (isAlarm){
      return { visibility: 'visible' }
    }
    else{
      return { visibility: 'hidden' }
    }
  }

  getVisible2(tagName: string){
    let isAlarm = false;
    var value : string;
    if (this.data && this.data.singleValue[tagName]) {
      value = this.data.singleValue[tagName].dataRecords[0].Value
      //console.log(value)
      isAlarm = value.toString() == 'true'
    }
    if (isAlarm){
      return { visibility: 'hidden' }
    }
    else{
      return { visibility: 'visible' }
    }
  }

  getStyle(tagName: string) {


    let isAlarm = false;

    switch (tagName) {

      // Case Not OK
      case 'PQM_Status':
      case 'RELAY_1_COMM_STATUS':
      case 'RELAY_2_COMM_STATUS':
      case 'DTSWG_Status':
      case 'DTMDB_Status': 
      case 'Weather1_Status':
      case 'Weather2_Status': 
      case 'PQM_Current':
        {
          if (this.data && this.data.singleValue[tagName] && this.data.singleValue[tagName].dataRecords[0] && this.data.singleValue[tagName].dataRecords[0].Value) {
            let value = this.data.singleValue[tagName].dataRecords[0].Value;
            isAlarm = value !== 'OK';
          }

          if (this.data && this.data.singleValue[tagName] && this.data.singleValue[tagName].unit) {
            let unit = this.data.singleValue[tagName].unit;
            isAlarm = unit !== 'AB';
          }
          break;
        }
      //Case > 0
      case 'SINV01_ALM':
      case 'SINV02_ALM':
      case 'SINV03_ALM':
      case 'SINV04_ALM':
      case 'SINV05_ALM':
      case 'SINV06_ALM':
      case 'SINV07_ALM':
      case 'SINV08_ALM':
      case 'SINV09_ALM':
      case 'SINV10_ALM':
      case 'SINV11_ALM':
      case 'SINV12_ALM':
        {
          if (this.data && this.data.singleValue[tagName] && this.data.singleValue[tagName].dataRecords[0] && this.data.singleValue[tagName].dataRecords[0].Value) {
            let value = this.data.singleValue[tagName].dataRecords[0].Value;
            isAlarm = value !== '0';
          }
          break;
        }
      //Case = TRIP
      case 'DTMDB_TXT':
      case 'DTSWG_TXT':
        {
          if (this.data && this.data.singleValue[tagName] && this.data.singleValue[tagName].dataRecords[0] && this.data.singleValue[tagName].dataRecords[0].Value) {
            let value = this.data.singleValue[tagName].dataRecords[0].Value;
            isAlarm = value == 'TRIP';
          }
          break;
        }
      //Case != NORMAL
      case 'FIRE_STATUS':
      case 'TR_OIL_STATUS':
        {
          if (this.data && this.data.singleValue[tagName] && this.data.singleValue[tagName].dataRecords[0] && this.data.singleValue[tagName].dataRecords[0].Value) {
            let value = this.data.singleValue[tagName].dataRecords[0].Value;
            isAlarm = value !== 'NORMAL';
          }
          break;
        }

      default: {
        break;
      }
    }

    if (isAlarm) return { fill: 'red', opacity: 1,  animation: 'blinker 2s linear infinite' }
    else return {}
    //  return { fill: 'red', opacity: 1, animation: blink 0.8s infinite;  }
  }



  async init() {
    const dashboardConfigs = await this.getDiagramConfigs();
    const requests = this.createRequests(dashboardConfigs);
    await this.store.dispatch(new SetDiagramRequest(requests)).toPromise();
    const data = await this.requestData();
    await this.addDataToStore(data);
    
    this.loadSingleValue();
    this.startTimer(this.appLoadService.Config.Timer * 30000);

  }

  async getDiagramConfigs() {
    const diagramConfig: DiagramConfigModel[] = await this.httpService.getConfig('assets/diagram/configurations/diagram.config.json');
    const invAlarm: InverterAlarmModel[] = await this.httpService.getConfig('assets/main/inverter.alarm.json');
    if(invAlarm){
      //console.log(invAlarm)
      this.invAlarmConfig = invAlarm;
    }
    // const diagramEquip: DiagramEquipmentModel[] = await this.httpService.getConfig('assets/diagram/equipments/' + this.siteName.id + '.equipment.json');
    // if(diagramEquip){
    //   this.equipmentList = diagramEquip;
    // }
    this.store.dispatch(new SetDiagramConfigs(diagramConfig));
    return diagramConfig;
  }

  /*private transformDiagramConfig(diagramConfig: DiagramConfig[]) {
    const models: DiagramConfigStateModel[] = diagramConfig.map(x => {
      const m: DiagramConfigStateModel = {
        name: x.Name,
        tagName: x.TagName,
        title: null,
        type: x.Type,
      };
      return m;
    });
    return models;
  }*/

  async registerTags(diagramConfigs: any[]) {
    const tagNames = await this.digramTagService.getTagNames(diagramConfigs);
    await this.store.dispatch(new AddTags(tagNames)).toPromise();
  }

  createRequests(diagramConfigs: DiagramConfigModel[]) {
    const requests = this.diagramRequestService.createRequest(diagramConfigs);
    return requests;

  }


  async requestData(): Promise<any[]> {
    const requests = this.store.selectSnapshot(DiagramRequestState);
    const data = await this.httpService.getRealtime(requests);
    //console.log(data)
    return data;

  }

  async addDataToStore(data: any[]) {
    const Datas: DiagramResRealtime[] = data;
    let newData: DiagramLastValuesModel[] = []
    Datas.forEach((item) => {
      let record:DiagramLastValuesModel = {
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
    await this.store.dispatch(new SetDiagramValues(newData)).toPromise();
  }

  

  loadSingleValue() {
    const curr = this.diagramLastValuesService.getCurrentGroupData();
    //const atTime = this.diagramLastValuesService.getAtTimeGroupData();
    this.data.singleValue = { ...curr };
    this.cd.markForCheck();
  }

  startTimer(dueTimer: number) {
    const _timer = timer(dueTimer, dueTimer).subscribe(x => {
      this.timerTick();
    });
    this.subscriptions.push(_timer);
  }

  async timerTick() {

    const data = await this.requestData();
    await this.addDataToStore(data);
    this.loadSingleValue();
    this.cd.markForCheck();
  }

  private async updateCurrentData(res: DiagramLastValuesStateModel[]) {
    await this.updateCurrentValues(res, ValueType.RealTime);
    await this.updateCurrentValues(res, ValueType.AtTime);
    this.loadSingleValue();
    this.cd.markForCheck();
  }



  private async updateCurrentValues(res: DiagramLastValuesStateModel[], valueType: ValueType) {
    const requests: DiagramRequestStateModel[] = this.store.selectSnapshot(DiagramRequestState.getRequest());
    requests.forEach(async at => {
      const id = at.RequestId;
      const valueRes = res.find(r => r.RequestId === id);
      if (valueRes) {
        //await this.store.dispatch(new ChangeDiagramLastValues(id, valueRes.DataSets)).toPromise();
      }
    });
  }

  isNumber(e) {
    return typeof e === 'number';
  }

  checkEquipment(eq: string){
    const res = this.equipmentList.find(x => x.name == eq);
    if(res){
      return res.status;
    } else {
      return true;
    }
  }
}

export interface InverterAlarmModel{
  id: number;
  level: string;
  name: string;
}
