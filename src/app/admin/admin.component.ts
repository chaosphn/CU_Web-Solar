import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DateTimeService } from '../share/services/datetime.service';
import { HttpService } from '../share/services/http.service';
import { HolidayRequestModel, HolidayResponseModel, ReportFactorModel, SetHolidayModel } from '../share/models/report.model';

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
  reportFactors: ReportFactorModel = {
    ExchangeRate: 0.000,
    CO2Rate: 0,
    OilRate: 0,
    TreeRate: 0,
    TimeStamp:''
  };
  constructor(private dateTimeService: DateTimeService,
    private httpSrv: HttpService
  ) { }

  ngOnInit() {
    const date = new Date();
    date.setDate(2);
    this.holidayArr.push(new Date(date));
    this.getFactors();
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

  async getFactors(){
    const fct = await this.httpSrv.getReportfactor();
    if(fct){
      this.reportFactors = fct;
    } else {
      alert('Report factor not found!');
    }
  }

  async setFactors(){
    if(this.validateFactors(this.reportFactors)){
      this.reportFactors.TimeStamp = this.dateTimeService.getDateTime(new Date());
      const setFct = await this.httpSrv.setReportfactor(this.reportFactors);
      if(setFct && setFct.acknowledged){
        alert('Update report factor success!');
      }
    } else {
      alert('Factors is incorrect !');
    }
  }

  setHolidays(){
    if(this.holidayArr){
      const req: SetHolidayModel[] = this.holidayArr.map(function(item){
        let dateTime = item.getTime(); 
        let hld: SetHolidayModel =  {
          Name: "Custom Holiday",
          Type: 'costom',
          StartDate: new Date(dateTime),
          EndDate: new Date(dateTime+(24*60*60*1000))
        };
        return hld;
      });
      console.log(req);
      if(req){ this.httpSrv.setReportHoliday(req); }
    } else {
      alert('Please select date!');
    }
  }

  validateFactors(item: ReportFactorModel){
    if(item && item.ExchangeRate > 0 && item.CO2Rate > 0 && item.OilRate > 0 && item.TreeRate > 0){
      return true;
    } else {
      return false;
    }
  }

}
