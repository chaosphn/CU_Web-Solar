import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DateTimeService } from './../share/services/datetime.service';
import { HttpService } from './../share/services/http.service';
import { WriteDataRequest, DataSet, DataRecords } from 'src/app/core/stores/last-values/dashboard/dashboard-last-values.model';
import { DateTime } from '../share/components/sat-chart/sat-chart.component';
import { MatDialog } from '@angular/material/dialog'
import { DashboardRequestStateModel } from '../core/stores/requests/dashboard/dashboard-request.model';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-ctl',
  templateUrl: './ctl.component.html',
  styleUrls: ['./ctl.component.scss']
})
export class CtlComponent implements OnInit {

  enableManualZeroExport: number = 1;
  limitPowerWatt: number;
  password: string = '';
  correctPassword: string = '12345678';
  res: boolean = false;

  selectEnable: string = '0';
  selectWeather: number = 1;
  selectMDB: number = 0;
  MDBSTATUS: string = '-----';
  WEATHERSTATUS: string = '-----';

  timerSubscription: Subscription;


  constructor(private dateTimeService: DateTimeService,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private httpService: HttpService) {


  }

  setValue() {
    if (this.password == this.correctPassword) {
      let writeRequests: WriteDataRequest[] = [];

      if (this.limitPowerWatt != null) {
        if (this.limitPowerWatt >= 1 && this.limitPowerWatt <= 100) {
          writeRequests.push(this.getInverterLimitPower());
        }
        else {
          alert('Please Set the Inverter Limit Power between 1 to 100');
          return;
        }
      }
      writeRequests.push(this.getEnableLimitPower());
      this.httpService.writeData(writeRequests);
      alert('Done.');

    }
    else { alert('Incorrect Password.'); }

    this.limitPowerWatt = null;
    this.password = null;
  }

  setExport() {

    if (this.password == this.correctPassword) {
      let writeRequests: WriteDataRequest[] = [];
      console.log(this.selectEnable.toString())
      writeRequests.push(this.getWrite('MITRPHOL\\SCADA\\Bypass_zero', this.selectEnable.toString()));
      this.httpService.writeData(writeRequests);
      alert('Done.');
    }
    else { alert('Incorrect Password.'); }
    this.password = null;
  }

  setWeather() {
    if (this.password == this.correctPassword) {
      let writeRequests: WriteDataRequest[] = [];
      writeRequests.push(this.getWrite('MITPHOL\\SCADA\\SEL_WEATHER', this.selectWeather.toString()));
      this.httpService.writeData(writeRequests);
      alert('Done.');

    }
    else { alert('Incorrect Password.'); }
    this.password = null;
  }

  setMDB() {
    if (this.password == this.correctPassword) {
      let writeRequests: WriteDataRequest[] = [];

      if (this.selectMDB == 0) {
        writeRequests.push(this.getWrite('MITPHOL\\SCADA\\ACB_CLOSE_CMD', this.selectWeather.toString()));
      }
      else if (this.selectMDB == 1) {
        writeRequests.push(this.getWrite('MITPHOL\\SCADA\\ACB_OPEN_CMD', this.selectWeather.toString()));
      }
      this.httpService.writeData(writeRequests);
      alert('Done.');

    }
    else { alert('Incorrect Password.'); }
    this.password = null;
  }

  async readStatus() {
    let readReq: DashboardRequestStateModel[] = [];
    readReq.push(this.getReadReq());
    const res = await this.httpService.getData(readReq);
    let val: string
    val = res[0].DataSets[0].Records[0].Value.toString();
    if (val == 'true') {
      this.MDBSTATUS = 'ENABLE'
    }
    else{
      this.MDBSTATUS = 'DISABLE'
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



  getReadReq(): DashboardRequestStateModel {

    let readReq: DashboardRequestStateModel = {
      RequestId: '9852454753',
      ItemIds: [181],
      Mode: 'RealTime'
    };
    return readReq;
  }


  getEnableLimitPower(): WriteDataRequest {
    const record: DataRecords =
    {
      Timestamp: this.getNow(),
      Value: this.enableManualZeroExport.toString(),
      Quality: 'Good'
    };

    const dataSet: DataSet =
    {
      ItemName: "Kasetchai\\Summary\\LIM_MAN",
      Records: [record]
    };
    let writeRequest: WriteDataRequest = { DataSets: [dataSet] };
    return writeRequest;
  }



  getInverterLimitPower(): WriteDataRequest {
    const record: DataRecords =
    {
      Timestamp: this.getNow(),
      Value: this.limitPowerWatt.toString(),
      Quality: 'Good'
    };

    const dataSet: DataSet =
    {
      ItemName: "Kasetchai\\Summary\\WMAN",
      Records: [record]
    };
    let writeRequest: WriteDataRequest = { DataSets: [dataSet] };
    return writeRequest;
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

  ngOnInit() {
    this.readStatus();
    this.startTimer(5000);
  }

}

export interface EventModel {
  PriorityLevel: number;
  AlarmChange: string;
  EventTime: string;
  ObjectName: string;
  ObjectDescription: string;
  Condition: string;
  SubCondition: string;
  Message: string;
}

export enum EventType {
  EVENT = 'EVENT',
  ALARM = 'ALARM',
}
