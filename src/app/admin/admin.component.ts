import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DateTimeService } from '../share/services/datetime.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewInit {

  removable = true;
  dateTime: Date = new Date();
  isInitialize: boolean = false;
  holidayArr: Date[] = [];
  constructor(private dateTimeService: DateTimeService) { }

  ngOnInit() {
    const date = new Date();
    date.setDate(2);
    this.holidayArr.push(new Date(date));
    //console.log(this.holiday)
  }

  ngAfterViewInit(): void {
    this.isInitialize = true;
  }

  onDateTimeChange(event) {
    if(this.isInitialize){
      this.dateTime = event;
      if(!this.holidayArr.find(x => this.dateTimeService.getDateTime(x).substring(0,11) == this.dateTimeService.getDateTime(this.dateTime).substring(0,11))){
        this.holidayArr.push(this.dateTime);
      }
    }
  }

  remove(idx: number){
    this.holidayArr.splice(idx, 1)
  }

}
