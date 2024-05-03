import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { Subscription, timer } from 'rxjs';
import { DiagramConfigStateModel } from '../core/stores/configs/diagram/diagram-config.model';
import { DiagramLastValuesStateModel } from '../core/stores/last-values/diagram/diagram-last-values.model';
import { ChangeDiagramLastValues, SetDiagramValues } from '../core/stores/last-values/diagram/diagram-last-values.state';
import { DiagramRequestStateModel } from '../core/stores/requests/diagram/diagram-request.model';
import { DiagramRequestState, SetDiagramRequest } from '../core/stores/requests/diagram/diagram-request.state';
import { AddTags } from '../core/stores/tags/tags.state';
import { MockDataService } from '../dashboard/services/mock-data.service';
import { DiagramConfig } from '../share/models/diagram-config.model';
import { GroupData } from '../share/models/value-models/group-data.model';
import { ValueType } from '../share/models/value-models/value-type.model';
import { AppLoadService } from '../share/services/app-load.service';
import { SetDiagramConfigs } from './../core/stores/configs/diagram/diagram-config.state';
import { DiagramLastValuesState } from './../core/stores/last-values/diagram/diagram-last-values.state';
import { HttpService } from './../share/services/http.service';
import { DiagramLastValuesService } from './services/diagram-last-values.service';
import { DiagramRequestService } from './services/diagram-request.service';
import { DigramTagService } from './services/diagram-tag.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiagramComponent implements OnInit, OnDestroy {

  color: string = "red";
  diagrams: any;
  subscriptions: Subscription[] = [];
  data: GroupData = {
    singleValue: {}
  };
  rp:number = 0;
  currentRoute: string;
  siteName: string = ''; 
  paunReal: ResponseReal[];
  paunHis: ResponseHis[];
  dataRealtime?: RealtimeValue = {};
  dataHistorian?: HistorianValue = {};

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
    private router: Router) { }

  ngOnInit() {
    localStorage.setItem('nowUrl',this.router.url.toString());
    this.currentRoute = this.router.url.toString()
    this.siteName = localStorage.getItem('location');
    console.log("component: "+this.currentRoute.slice(6)+" & site: " + this.siteName.toString());
    //this.init();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  getAlm(tagName){
    let isAlarm = false;
    var value : string;
    if (this.data && this.data.singleValue[tagName]) {
      value = this.data.singleValue[tagName].dataRecords[0].Value
      isAlarm = value.toString() == 'true'
    }
    //console.log(isAlarm)
    if (isAlarm){
      return { fill:'red',opacity: 1, animation: 'blinker 2s linear infinite'}
    }else{
      return { fill:'lime',opacity: 1}
    }
  }

  getAlm2(tagName){
    let isAlarm = false;
    var value : string;
    if (this.data && this.data.singleValue[tagName]) {
      value = this.data.singleValue[tagName].dataRecords[0].Value
      isAlarm = value.toString() == 'true'
    }
    //console.log(isAlarm)
    if (isAlarm){
      return { fill:'red',opacity: 1, animation: 'blinker 2s linear infinite'}
    }else{
      return { fill:'#f2f2f2',stroke:'#cccccc',opacity: 1}
    }
  }

  getComTxt(tagName){
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

  getAlmTxt(tagName){
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

  getRemote(tagName){
    let isAlarm = false;
    var value : string;
    if (this.data && this.data.singleValue[tagName]) {
      value = this.data.singleValue[tagName].dataRecords[0].Value
      //console.log(value)
      isAlarm = value.toString() == 'true'
    }
    if (isAlarm){
      return 'REMOTE'
    }else{
      return 'LOCAL'
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
      case 'SINV13_ALM':
      case 'SINV14_ALM':
      case 'SINV15_ALM':
      case 'SINV16_ALM':
      case 'SINV17_ALM':
      case 'SINV18_ALM':
      case 'SINV19_ALM':
      case 'SINV20_ALM':
      case 'SINV21_ALM':
      case 'SINV22_ALM':
      case 'SINV23_ALM':  
      case 'SINV24_ALM':
      case 'SINV25_ALM':
      case 'SINV26_ALM':
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



  // async init() {
  //   const hasLastValues: DiagramLastValuesStateModel[] = this.store.selectSnapshot(DiagramLastValuesState);
  //   if (hasLastValues.length === 0) {
  //     const dashboardConfigs = await this.getDiagramConfigs();
  //     await this.registerTags(dashboardConfigs);
  //     const models = this.transformDiagramConfig(dashboardConfigs);
  //     const requests = this.createRequests(models);
  //     await this.store.dispatch(new SetDiagramRequest(requests)).toPromise();
  //     const data = await this.requestData();
  //     await this.addDataToStore(data);
  //   }
  //   this.loadSingleValue();
  //   this.startTimer(this.appLoadService.Config.Timer * 1000);

  // }



  // initChartData() {
    
  // }

  // async getDiagramConfigs() {
  //   const diagramConfig: DiagramConfig[] = await this.httpService.getConfig('assets/diagram/configurations/diagram.config.json');
  //   this.digramTagService.addServerName(diagramConfig);
  //   const models = this.transformDiagramConfig(diagramConfig);
  //   this.store.dispatch(new SetDiagramConfigs(models));
  //   return diagramConfig;
  // }

  // private transformDiagramConfig(diagramConfig: DiagramConfig[]) {
  //   const models: DiagramConfigStateModel[] = diagramConfig.map(x => {
  //     const m: DiagramConfigStateModel = {
  //       name: x.Name,
  //       tagName: x.TagName,
  //       title: null,
  //       type: x.Type,
  //     };
  //     return m;
  //   });
  //   return models;
  // }

  // async registerTags(diagramConfigs: any[]) {
  //   const tagNames = await this.digramTagService.getTagNames(diagramConfigs);
  //   await this.store.dispatch(new AddTags(tagNames)).toPromise();
  // }

  // createRequests(diagramConfigs: DiagramConfigStateModel[]) {
  //   const requests = this.diagramRequestService.createRequest(diagramConfigs);
  //   return requests;

  // }


  // async requestData(): Promise<any[]> {
  //   const requests = this.store.selectSnapshot(DiagramRequestState);
  //   const data = await this.httpService.getData(requests);
  //   return data;

  // }

  // async addDataToStore(data: any[]) {
  //   await this.store.dispatch(new SetDiagramValues(data)).toPromise();
  // }

  // loadSingleValue() {
  //   const curr = this.diagramLastValuesService.getCurrentGroupData();
  //   const atTime = this.diagramLastValuesService.getAtTimeGroupData();
  //   this.data.singleValue = { ...curr, ...atTime };
  //   this.cd.markForCheck();
  // }

  // startTimer(dueTimer: number) {
  //   const _timer = timer(5000, dueTimer).subscribe(x => {
  //     this.timerTick();
  //   });
  //   this.subscriptions.push(_timer);
  // }

  // async timerTick() {
  //   const data = await this.requestData();
  //   await this.addDataToStore(data);
  //   this.loadSingleValue();
  //   this.cd.markForCheck();
  // }

  // private async updateCurrentData(res: DiagramLastValuesStateModel[]) {
  //   await this.updateCurrentValues(res, ValueType.RealTime);
  //   await this.updateCurrentValues(res, ValueType.AtTime);
  //   this.loadSingleValue();
  //   this.cd.markForCheck();
  // }



  // private async updateCurrentValues(res: DiagramLastValuesStateModel[], valueType: ValueType) {
  //   const requests: DiagramRequestStateModel[] = this.store.selectSnapshot(DiagramRequestState.getRequest(valueType));
  //   requests.forEach(async at => {
  //     const id = at.RequestId;
  //     const valueRes = res.find(r => r.RequestId === id);
  //     if (valueRes) {
  //       await this.store.dispatch(new ChangeDiagramLastValues(id, valueRes.DataSets)).toPromise();
  //     }
  //   });
  // }

  isNumber(e) {
    return typeof e === 'number';
  }
}

export interface ResponseReal{
  Name: string;
  Value: string;
  TimeStamp: string;
}
export interface ResponseHis{
  Name:string;
  records:Record[];
}
export interface Record{
  TimeStamp:string;
  Value:string;
}


export interface RealtimeValue{
  [name: string]: Value;
}

export interface HistorianValue{
  [name: string]: MultipleData1;
}

export interface Value{
  TimeStamp?: string;
  Value?: string;
}

export interface DataRecords1 {
  TimeStamp?: string;
  Value?: string;
}

export interface MultipleData1 {
  data?: DataRecords1[];
}
