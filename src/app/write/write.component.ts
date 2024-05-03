import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DateTimeService } from './../share/services/datetime.service';
import { HttpService } from './../share/services/http.service';
import { WriteDataRequest,DataSet, DataRecords } from 'src/app/core/stores/last-values/dashboard/dashboard-last-values.model';
import { DateTime } from '../share/components/sat-chart/sat-chart.component';

@Component({
  selector: 'app-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.scss']
})
export class WriteComponent implements OnInit {
 
  enableManualZeroExport: number = 1;
  limitPowerWatt: number;
  password: string = '';
  correctPassword: string = '12345678';

  constructor(private dateTimeService: DateTimeService,
    private datePipe: DatePipe,
    private httpService: HttpService) {
   
   
  }
  
  setValue()
  {
    if(this.password == this.correctPassword)
    {
      let writeRequests: WriteDataRequest[] = [];

      if(this.limitPowerWatt != null)
      { 
        if( this.limitPowerWatt >= 1 && this.limitPowerWatt <=100)
        {
          writeRequests.push(this.getInverterLimitPower());
        }
        else
        {
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

  // writeData()
  // {
  //   const record: DataRecords = 
  //               {
  //                 Timestamp: '2020-07-22T00:00:06+07:00', 
  //                 Value:'6', 
  //                 Quality:'Good'
  //               };
    
  //   const dataSet: DataSet = 
  //               {
  //                 ItemName: "GK17\\Calculation\\Power\\W", 
  //                 Records: [record] 
  //               };
    

  //   let writeRequest: WriteDataRequest = {DataSets: [dataSet]};
  //   let x = this.httpService.writeData([writeRequest]);

  // }


  getEnableLimitPower():WriteDataRequest
  {
    const record: DataRecords = 
                {
                  Timestamp: this.getNow(), 
                  Value: this.enableManualZeroExport.toString(), 
                  Quality:'Good'
                };
    
    const dataSet: DataSet = 
                {
                  ItemName: "Kasetchai\\Summary\\LIM_MAN", 
                  Records: [record] 
                };
                let writeRequest: WriteDataRequest = {DataSets: [dataSet]};
    return writeRequest;
  }

 

  getInverterLimitPower():WriteDataRequest
  {
    const record: DataRecords = 
                {
                  Timestamp: this.getNow(), 
                  Value:  this.limitPowerWatt.toString(), 
                  Quality:'Good'
                };
    
    const dataSet: DataSet = 
                {
                  ItemName: "Kasetchai\\Summary\\WMAN", 
                  Records: [record] 
                };
                let writeRequest: WriteDataRequest = {DataSets: [dataSet]};
    return writeRequest;
  }

  getNow(): string
  {
    var now = JSON.stringify(new Date()).replace(/\"/g, "");
    console.log(now);
    return now;

  }

  ngOnInit() {
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
