import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DatePipe } from '@angular/common';
import { DateTimeService } from '../../../share/services/datetime.service'
import { HttpService } from '../../../share/services/http.service';
import { WriteDataRequest, DataSet, DataRecords } from 'src/app/core/stores/last-values/dashboard/dashboard-last-values.model';
import { DashboardRequestStateModel } from '../../../core/stores/requests/dashboard/dashboard-request.model';
import { DashboardConfigStateModel } from '../../../core/stores/configs/dashboard/dashboard-configs.model';
import { DashboardTagService } from '../../../dashboard/services/dashboard-tag.service';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-dialog-ctl',
  templateUrl: './dialog-ctl.component.html',
  styleUrls: ['./dialog-ctl.component.scss']
})
export class DialogCtlComponent implements OnInit {

  enableManualZeroExport: number = 1;
  limitPowerWatt: number;
  password: string = '';
  correctPassword: string = '12345678';
  res: boolean = false;

  selectWeather: number =1;
  selectMDB: number=0;
  MDBSTATUS: string = '-----';
  WEATHERSTATUS: string = '-----';

  timerSubscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<DialogCtlComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private dateTimeService: DateTimeService,
    private datePipe: DatePipe,
    private dashboardTagService: DashboardTagService,
    private httpService: HttpService
  ) { }

  ngOnInit() {
    this.readStatus();
    this.getCTLConfig();
    this.startTimer(2000);
  }

  close(){
    this.dialogRef.close();
  }

  async getCTLConfig(){
    const dashboardConfigs: DashboardConfigStateModel[] = await this.httpService.getConfig('assets/dashboard/configurations/ctl.config.json');
    dashboardConfigs.filter(x => {
      if (x.options && x.options.runtimeConfigs) {
        x.options.runtimeConfigs.zoom = false;
        return x;
      }
    });
    this.dashboardTagService.addServerName(dashboardConfigs);
    console.log(dashboardConfigs)
    return dashboardConfigs;
  }

  setMDB() {
    if (this.password == this.correctPassword) {
      let writeRequests: WriteDataRequest[] = [];

      if (this.data['MDB'] == '1') {
        if (this.selectMDB == 0) {
          console.log('CLS')
          writeRequests.push(this.getWrite('MITRPHOL\\SCADA\\ACB1_CLOSE_CMD', 'true'));
        }
        else if (this.selectMDB == 1) {
          console.log('OPN')
          writeRequests.push(this.getWrite('MITRPHOL\\SCADA\\ACB1_OPEN_CMD', 'true'));
        }
      }
      if (this.data['MDB'] == '2') {
        if (this.selectMDB == 0) {
          writeRequests.push(this.getWrite('MITRPHOL\\SCADA\\ACB2_CLOSE_CMD', 'true'));
        }
        else if (this.selectMDB == 1) {
          writeRequests.push(this.getWrite('MITRPHOL\\SCADA\\ACB2_OPEN_CMD', 'true'));
        }
      }
      console.log(writeRequests)
      this.httpService.writeData(writeRequests);
      alert('Done.');
      this.dialogRef.close();

    }
    else { alert('Incorrect Password.'); }
    this.password = null;
  }

  getWrite(tag: string, val: string): WriteDataRequest {
    const record: DataRecords =
    {
      Timestamp: this.getNow(),
      Value: val,
      Quality: 'Good'
    };

  


    const dataSet: DataSet =
    {
      ItemName: tag,
      Records: [record]
    };
    let writeRequest: WriteDataRequest = { DataSets: [dataSet] };
    return writeRequest;
  }

  getNow(): string {
    var now = JSON.stringify(new Date()).replace(/\"/g, "");
    //console.log(now);
    return now;

  }

  async readStatus(){
    let readReq: DashboardRequestStateModel[] = [];
    readReq.push(this.getReadReq());
    const res = await this.httpService.getData(readReq);
    let status,status2:string;
    if(this.data['MDB'] == '1'){
      status = res[0].DataSets[0].Records[0].Value.toString();
      status2 = res[0].DataSets[1].Records[0].Value.toString();
      if(status == 'true'){
        this.MDBSTATUS = "OPEN"
      }
      else if(status2 == 'true'){
        this.MDBSTATUS = "CLOSE"
      }
      else{
        this.MDBSTATUS = "UNKNOW"
      }
    }
    if(this.data['MDB'] == '2'){
      status = res[0].DataSets[3].Records[0].Value.toString();
      status2 = res[0].DataSets[2].Records[0].Value.toString();
      if(status == 'true'){
        this.MDBSTATUS = "OPEN"
      }
      else if(status2 == 'true'){
        this.MDBSTATUS = "CLOSE"
      }
      else{
        this.MDBSTATUS = "UNKNOW"
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
    this.readStatus();
  }

  unsubscribe() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }



  getReadReq(): DashboardRequestStateModel{
    
    let readReq:DashboardRequestStateModel = {
      RequestId: '9852454753',
      ItemIds: [151,155,162,160],
      Mode: 'RealTime'
    };
    return readReq;
  }

 

}
