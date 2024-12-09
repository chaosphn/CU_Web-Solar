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
  holidays: HolidayResponseModel[] = [];
  reportFactors: ReportFactorModel = {
    ExchangeRate: 0.000,
    OnPeakRate: 0.000,
    OffPeakRate: 0.000,
    FT: 0.000,
    CO2Rate: 0,
    OilRate: 0,
    TreeRate: 0,
    TimeStamp:''
  };
  monthArr: any[] = [ {no: 1, name: 'Jan'}, {no: 2, name: 'Feb'}, {no: 3, name: 'Mar'}, {no: 4, name: 'Apr'}, {no: 5, name: 'May'}, {no: 6, name: 'Jun'}, {no: 7, name: 'Jul'}
    ,{no: 8, name: 'Aug'} ,{no: 9, name: 'Sep'} ,{no: 10, name: 'Oct'} ,{no: 11, name: 'Nov'} ,{no: 12, name: 'Dec'}
   ]
  constructor(private dateTimeService: DateTimeService,
    private httpSrv: HttpService
  ) { }

  ngOnInit() {
    const date = new Date();
    console.log(date.getMonth())
    // date.setDate(2);
    // this.holidayArr.push(new Date(date));
    this.getFactors();
    this.initHolidays();
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
    const set = confirm('Please make sure before setFactors!');
    if(this.validateFactors(this.reportFactors) && set){
      this.reportFactors.TimeStamp = this.dateTimeService.getDateTime(new Date());
      const setFct = await this.httpSrv.setReportfactor(this.reportFactors);
      if(setFct && setFct.acknowledged){
        alert('Update report factor success!');
      }
    }
  }

  setHolidays(){
    const set = confirm('Please make sure before setHolidays!');
    if(this.holidayArr.length > 0 && set){
      const req: SetHolidayModel[] = this.holidayArr
      .filter(x => !this.holidays.find(d => new Date(d.StartDate).getTime() == x.getTime()))
      .map(function(item){
        let dateTime = item.getTime(); 
        let hld: SetHolidayModel =  {
          Name: "Custom Holiday",
          Type: 'costom',
          StartDate: new Date(dateTime),
          EndDate: new Date(dateTime+(24*60*60*1000))
        };
        return hld;
      });
      //console.log(req)
      if(req.length > 0){ this.httpSrv.setReportHoliday(req); }
    } else if(this.holidayArr.length == 0 ){
      alert('Please select date!');
    }
  }

  validateFactors(item: ReportFactorModel){
    if(item && item.ExchangeRate > 0 && item.CO2Rate > 0 && item.OilRate > 0 && item.TreeRate > 0){
      return true;
    } else {
      alert('Factors is incorrect !');
      return false;
    }
  }

  async initHolidays(){
    const req: HolidayRequestModel = {
      StartDate: this.dateTimeService.getDateTime(new Date(this.dateTime.getFullYear(), 0, 1)),
      EndDate: this.dateTimeService.getDateTime(new Date(this.dateTime.getFullYear(), 11, 31))
    };
    const res: HolidayResponseModel[] = await this.httpSrv.getReportHoliday(req); 
    if(res){
      res.forEach(item => {
        let start = new Date(item.StartDate).getTime();
        let end = new Date(item.EndDate).getTime();
        let dayMillisec = 24*60*60*1000;
        this.holidayArr.push(new Date(item.StartDate));
      });
      this.holidays = res;
    } else {
      alert('Report factor not found!');
    }
  }

  async selectHolidays(date: any){

    if(this.isInitialize){
      this.holidayArr = [];
      this.holidays = [];
      const dateTime = new Date(date);
      const req: HolidayRequestModel = {
        StartDate: this.dateTimeService.getDateTime(new Date(dateTime.getFullYear(), 0, 1)),
        EndDate: this.dateTimeService.getDateTime(new Date(dateTime.getFullYear(), 11, 31))
      };
      const res: HolidayResponseModel[] = await this.httpSrv.getReportHoliday(req); 
      if(res){
        res.forEach(item => {
          let start = new Date(item.StartDate).getTime();
          let end = new Date(item.EndDate).getTime();
          let dayMillisec = 24*60*60*1000;
          this.holidayArr.push(new Date(item.StartDate));
        });
        this.holidays = res;
      } else {
        alert('Report factor not found!');
      }
  }}

  filterDateByMonth(m: number, dates: Date[]){
    return dates.filter(x => x.getMonth()+1 == m);
  }

}
