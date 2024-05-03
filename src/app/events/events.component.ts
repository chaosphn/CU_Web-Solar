import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DateTimeService } from './../share/services/datetime.service';
import { HttpService } from './../share/services/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  startTime: Date;
  endTime: Date;
  selectedObject: any;
  objName = '';
  loading = false;
  pristine = false;
  headers: string[] = ['Priority Level', 'Alarm Change', 'Event Time', 'Object Description', 'OBJECT NAME', 'CONDITION', 'SUB CONDITON', 'MESSAGE'];
  periodName: string;
  periodNames = ['T', '7D', '30D', '3M', '12M'];
  events: EventModel[] = [];
  maxEvents: string = '1000';
  currentRoute: string;
  siteName: string = '';

  constructor(private dateTimeService: DateTimeService,
    private datePipe: DatePipe,
    private httpService: HttpService,
    private router: Router) {
    // this.selectedObject = this.objects[0];
    this.initDateTime();
  }

  

  ngOnInit() {
    
  }

  initDateTime() {
    const period = this.dateTimeService.parseDate('t');
    this.startTime = new Date(period.startTime);
    this.endTime = new Date(period.endTime);
  }



  async selectObject() {
    this.loading = true;
    try {

      const st = this.datePipe.transform(this.startTime, 'yyyy-MM-dd HH:mm:ss');
      const ed = this.datePipe.transform(this.endTime, 'yyyy-MM-dd HH:mm:ss');
      const req = {
        StartTime: st,
        EndTime: ed,
        FilterObjectName: this.objName,
        MaxEvents: this.maxEvents
      };

      const _event: EventModel[] = await this.httpService.getAlarmEvent(req);
      // _event.forEach(e => {
      //   e.EventTime = e.EventTime.t
      // });
      this.events = _event;
      this.pristine = true;
      this.loading = false;
    } catch (error) {
      alert('Get alarm failed.');
      this.loading = false;
    }

  }

  selectStartTime(newDate: Date) {
    this.startTime = newDate;
  }

  selectEndTime(newDate: Date) {
    this.endTime = newDate;
  }

  download1() {
    const csvContent = this.getCSVContent();
    const filename = this.getFileName();
    const _a = document.createElement('a');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    _a.href = url;
    _a.setAttribute('download', filename);
    document.body.appendChild(_a);
    _a.click();

    setTimeout(function(){
      document.body.removeChild(_a);
      window.URL.revokeObjectURL(url);  
    }, 100);  
  }

  


  download() {
    // const csvContent = this.getCSVContent();
    // const filename = this.getFileName();
    // const blob = new Blob([csvContent], { type: 'application/octet-stream' });
    // // const _a = document.createElement('a');
    // // // alert(filename);
    // // // const url = URL.createObjectURL(blob);
    // // // window.open(url, '_blank');
    // FileSaver.saveAs(blob, filename);


    const st = this.datePipe.transform(this.startTime, 'yyyy-MM-dd HH:mm:ss');
    const ed = this.datePipe.transform(this.endTime, 'yyyy-MM-dd HH:mm:ss');
    const FilterObjectName = this.objName || '';
    this.httpService.downloadFileAlarm(st, ed, FilterObjectName, this.maxEvents);
  }

  getFileName(): string {
    const stYear = this.addZeroPrefix(this.startTime.getFullYear(), 4);
    const stMonth = this.addZeroPrefix(this.startTime.getMonth() + 1);
    const stDate = this.addZeroPrefix(this.startTime.getDate());
    const stHour = this.addZeroPrefix(this.startTime.getHours());
    const stMin = this.addZeroPrefix(this.startTime.getMinutes());
    const edYear = this.addZeroPrefix(this.endTime.getFullYear(), 4);
    const edMonth = this.addZeroPrefix(this.endTime.getMonth() + 1);
    const edDate = this.addZeroPrefix(this.endTime.getDate());
    const edHour = this.addZeroPrefix(this.endTime.getHours());
    const edMin = this.addZeroPrefix(this.endTime.getMinutes());
    const filename = `Events${stYear}_${stMonth}_${stDate}_${stHour}_${stMin} - ${edYear}_${edMonth}_${edDate}_${edHour}_${edMin}.csv` ;
    return filename ;
  }

  addZeroPrefix(number: number, decimal = 2): string {
    return ('0' + number).slice(-(decimal));
   }

  getCSVContent(): string {
    const headers = this.headers.join(',');
    let contents = headers + '\n';

    this.events.forEach(x => {
      const content = `${x.PriorityLevel},${x.AlarmChange},${x.EventTime},${x.ObjectName},${x.ObjectDescription},${x.Condition},${x.SubCondition},${x.Message}`;
      contents += content + '\n';
    });
    return contents;
  }


  check() {
    this.httpService.checkToken();
  }

  selectedPeriod(periodName: string) {
      this.periodName = periodName;
      const period = this.dateTimeService.parseDate(periodName);
      this.startTime = new Date(period.startTime);
      this.endTime = new Date(period.endTime);
      this.selectObject();
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
