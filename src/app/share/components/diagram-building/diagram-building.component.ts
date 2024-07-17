import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { BuildingModel } from 'src/app/core/stores/sites/sites.model';
import { SingleValue } from '../../models/value-models/group-data.model';
import { HttpService } from '../../services/http.service';
import { DashboardConfigs, DashboardConfigsRealtime } from 'src/app/core/stores/configs/dashboard/dashboard-configs.model';
import { DashboardReqRealtime } from 'src/app/core/stores/requests/dashboard/dashboard-request.model';
import { DashboardResRealtime } from 'src/app/core/stores/last-values/dashboard/dashboard-last-values.model';
import { DialogbreakerComponent } from '../dialogbreaker/dialogbreaker.component';
import { Store } from '@ngxs/store';
import { SitesState } from 'src/app/core/stores/sites/sites.state';

@Component({
  selector: 'app-diagram-building',
  templateUrl: './diagram-building.component.html',
  styleUrls: ['./diagram-building.component.scss']
})
export class DiagramBuildingComponent implements OnInit {

  configs: DashboardConfigsRealtime[] = [];
  request: DashboardReqRealtime = {
    Tags: []
  };
  value: SingleValue = {};
  siteSelected: BuildingModel;

  constructor( public dialogRef: MatDialogRef<DiagramBuildingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DiagramInfo,
    private http: HttpService,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private store: Store
  ) { }

  ngOnInit() {
    this.init02();
  }

  close() {
    this.dialogRef.close();
  }

  private async init02()
  {
    const dashboardConfigs = await this.getDashboardConfigs();
    if(dashboardConfigs){
      this.configs = dashboardConfigs.realtimeConfig;
      this.createRequests();
      const realtimeData:DashboardResRealtime[] = await this.requestRawData();
      if(realtimeData){
        this.configs.forEach((item) => {
          let val = realtimeData.find(x => x.Name == item.Name);
          this.value[item.Title] = {
            tagNames: val ? [val.Name] : [],
            dataRecords: [{ Value: val ? val.Value : '---', Timestamp: val ? val.TimeStamp : '' }],
            unit: val ? val.Unit : '',
            minValue: val ? val.Min : '',
            maxValue: val ? val.Max : ''
          };
        })
      }
    }
    this.cd.markForCheck()
  }

  createRequests(){
    if(this.configs){
      this.configs.map(x => this.request.Tags.push(x.Name));
    }
  }

  async getDashboardConfigs() {
    const building = this.store.selectSnapshot(SitesState.getSiteWithId(this.data.ids));
    if(building){this.siteSelected = building;};
    const dashboardConfigs: DashboardConfigs = await this.http.getConfig2('assets/building/configurations/building['+this.data.ids+'].config.json');
    return dashboardConfigs;
  }

  async requestRawData(): Promise<any[]> {
    const data = await this.http.getRealtime(this.request);
    return data;
  }

  getAlmRun(tagName: string){
    let isAlarm = false;
    var value : string;
    if (this.data && this.value[tagName]) {
      value = this.value[tagName].dataRecords[0].Value
      isAlarm = value.toString() == '1'
    }
    //, animation: 'blinker 2s linear infinite'
    if (!isAlarm){
      return { fill:'crimson',opacity: 1}
    }else{
      return { fill:'#00c300', opacity: 1, padding: '10px'}
    }
  }

  getAlmCB(tagName: string){
    let isAlarm = false;
    var value : string;
    if (this.data && this.value[tagName]) {
      value = this.value[tagName].dataRecords[0].Value
      isAlarm = value.toString() == '1'
    }
    //, animation: 'blinker 2s linear infinite'
    if (isAlarm){
      return { opacity: 1, stroke: '#DC143C'}
    }else{
      return {  opacity: 1, stroke: '#00F536'}
    }
  }

  getRunTxt(tagName: string){
    let isAlarm = false;
    var value : string;
    if (this.data && this.value[tagName]) {
      value = this.value[tagName].dataRecords[0].Value
      isAlarm = value.toString() == '1';
    }
    if (isAlarm){
      return 'RUN'
    }else{
      return 'STOP'
    }
  }

  getCbStatus(tagName: string){
    let isAlarm = false;
    var value : string;
    if (this.data && this.value[tagName]) {
      value = this.value[tagName].dataRecords[0].Value
      isAlarm = value.toString() == '1';
    }
    if (isAlarm){
      return true;
    }else{
      return false;
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
      this.updateData()
    });
  }

  async updateData(){
    const realtimeData:DashboardResRealtime[] = await this.requestRawData();
    if(realtimeData){
      this.configs.forEach((item) => {
        let val = realtimeData.find(x => x.Name == item.Name);
        this.value[item.Title] = {
          tagNames: val ? [val.Name] : [],
          dataRecords: [{ Value: val ? val.Value : '---', Timestamp: val ? val.TimeStamp : '' }],
          unit: val ? val.Unit : '',
          minValue: val ? val.Min : '',
          maxValue: val ? val.Max : ''
        };
      })
    }
    this.cd.markForCheck()
  }

}

export interface DiagramInfo{
    ids: string;
    invNum: number;
}