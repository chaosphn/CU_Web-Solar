import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReportRequest } from '../share/models/requests/report-request.model';
import { DateTimeService } from '../share/services/datetime.service';
import { HttpService } from './../share/services/http.service';
import { ReportHttpService } from './services/report-http.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EventService } from '../share/services/event.service';
import { BuildingModel, SiteStateModel } from '../core/stores/sites/sites.model';
import { Store } from '@ngxs/store';
import { SitesState } from '../core/stores/sites/sites.state';
import { DashboardReqHistorian } from '../core/stores/requests/dashboard/dashboard-request.model';
import { DashboardResHistorian, Record } from '../core/stores/last-values/dashboard/dashboard-last-values.model';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { DashboardConfigStateModel } from '../core/stores/configs/dashboard/dashboard-configs.model';
import { ChartParameters, HAlign, LegendParameter, Series, VAlingn, columns } from '../share/models/sat-chart';
import { UUID } from 'angular2-uuid';
import { ReportChartService } from './services/report-chart.service';
import { Chart } from 'angular-highcharts';
import { OrderByPipe } from '../share/pipe/order-by.pipe';
import * as XLSX from 'xlsx';
import { HolidayRequestModel, HolidayResponseModel, ReportFactorModel, ReportRequestModel } from '../share/models/report.model';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { image } from 'html2canvas/dist/types/css/types/image';;

pdfMake.vfs = pdfFonts.pdfMake.vfs;





@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  dateTime: Date;
  reportConfig: ReportConfigModel[] = [];
  pdf: string;
  selectedReport: ReportConfigModel;
  renderReport?: ReportConfigModel;
  selectedGroupReport: ReportConfigModel[] = [];
  reportFactors: ReportFactorModel = {
    ExchangeRate: 2.95,
    OnPeakRate: 4.1839,
    OffPeakRate: 2.6037,
    FT: 0.0193,
    CO2Rate: 1,
    OilRate: 1,
    TreeRate: 1,
    TimeStamp:''
  };
  startView: string;
  currentRoute: string;
  siteName: string = ''; 
  siteSelected: BuildingModel;
  overallSelected: BuildingModel = {
    no:"1000",
    id:"overall",
    zone:"overall",
    name:"Overall",
    capacity: 6364,
    display: true,
    building: []
  };
  buildingList: BuildingModel[] = [];
  sub1: Subscription;
  startTime: string;
  endTime: string;
  request: DashboardReqHistorian[] = [];
  response: DashboardResHistorian[] = [];
  dateColumn: Date[] = [];
  dataTable: any[][] = [];
  dataGroupTable: TableGroupModel[] = [];
  chartParameters: ChartParameters;
  uuid: string;
  chart: Chart;
  loading: boolean = false;
  holiday: string[] = [];
  adminAccess: boolean = false;
  downloadTxt: boolean = false;
  oldReportData: string = '';
  isHide: boolean = true;

  @ViewChild('htmlTable') pdfTable: ElementRef;

  constructor(private httpService: HttpService,
    private reportHttpService: ReportHttpService,
    private datePipe: DatePipe,
    private dateTimeService: DateTimeService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private event: EventService,
    private store: Store,
    private chartService: ReportChartService) {
      this.sub1 = this.event.triggerFunction$.subscribe(() => {
      });
    }

  async ngOnInit() {
    this.uuid = UUID.UUID();
    const userRole = localStorage.getItem('role');
    if(userRole.toLowerCase().includes('admin')){
      this.isHide = true;
    }
    this.dateTime = new Date(new Date().setDate(new Date().getDate()-1));
    await this.getConfig();
    this.initReportSelect();
    this.initSiteSelect();
    await this.getFactors();
  }

  gteChart(data: any[], type: string, charttype?: string){
    const orderPipe = new OrderByPipe();
    if(charttype && charttype.toLocaleLowerCase() == 'group'){
      const chartGroup = new Chart({
        credits: {
          enabled: false,
        },
        chart: {
          type: 'column',
          height: 220
        },
        title: {
          text: '',
          align: ''
          
        },
        exporting: {
          enabled: false,
        },
        xAxis: {
          categories: orderPipe.transform(data, 0).map(x => this.datePipe.transform(x[0], type))
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Energy (kWh)'
          }
        },
        tooltip: {
          pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y} kWh</b> ({point.percentage:.0f}%)<br/>',
          shared: true
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            dataLabels: {
              enabled: false,
            }
          }
        },
        series: [
          {
            name: 'Energy Purchased',
            data: orderPipe.transform(data, 0).map(x => parseFloat(x[4])),
            color: '#fdc04e',
            stack: 'Purchased'
          },
          {
            name: 'Energy On Peak',
            data: orderPipe.transform(data, 0).map(x => parseFloat(x[2])),
            color: '#F05C5C',
            stack: 'Production'
          },
          {
            name: 'Energy Off Peak',
            data: orderPipe.transform(data, 0).map(x => parseFloat(x[3])),
            color: '#0DD141',
            stack: 'Production'
          }
        ]
      });
      return chartGroup;
    } else {
      const chart = new Chart({
        credits: {
          enabled: false,
        },
        chart: {
          type: 'column',
          height: 220
        },
        title: {
          text: '',
          align: ''
          
        },
        exporting: {
          enabled: false,
        },
        xAxis: {
          categories: orderPipe.transform(data, 0).map(x => this.datePipe.transform(x[0], type))
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Energy (kWh)'
          }
        },
        tooltip: {
          pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y} kWh</b> ({point.percentage:.0f}%)<br/>',
          shared: true
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            dataLabels: {
              enabled: false,
            }
          }
        },
        series: [
          {
            name: 'Energy On Peak',
            data: orderPipe.transform(data, 0).map(x => parseFloat(x[2])),
            color: '#F05C5C'
          },
          {
            name: 'Energy Off Peak',
            data: orderPipe.transform(data, 0).map(x => parseFloat(x[3])),
            color: '#0DD141'
          }
        ]
      });
      return chart;
    }
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
  }


  async getFactors(){
    const fct = await this.httpService.getReportfactor();
    if(fct){
      this.reportFactors = fct;
    } else {
      alert('Report factor not found!');
    }
  }

  initReportSelect() {
    if (this.reportConfig.length > 0) {
      this.selectedReport = this.reportConfig[0];
    }
  }

  initSiteSelect() {
    if (this.buildingList.length > 0) {
      this.siteSelected = this.buildingList[0];
      this.siteName = this.buildingList[0].id;
    }
  }

  async initHolidays(){
    if(this.dateTime){
      this.holiday = [];
      const req: HolidayRequestModel = {
        StartDate: this.dateTimeService.getDateTime(new Date(this.dateTime.getFullYear(), 0, 1)),
        EndDate: this.dateTimeService.getDateTime(new Date(this.dateTime.getFullYear(), 11, 31))
      };
      const res: HolidayResponseModel[] = await this.httpService.getReportHoliday(req); 
      if(res){
        res.forEach(item => {
          let start = new Date(item.StartDate).getTime();
          let end = new Date(item.EndDate).getTime();
          let dayMillisec = 24*60*60*1000;
          if(end - start <= dayMillisec ){
            this.holiday.push(this.dateTimeService.getDateTime(new Date(item.StartDate)));
          } else {
            for (let stD = start; stD < end; stD += (dayMillisec)) {
              this.holiday.push(this.dateTimeService.getDateTime(new Date(stD)));
            }
          }
        })
      } else {
        alert('Report factor not found!');
      }
    }
  }

  async getConfig() {
    const config: SiteStateModel = await this.httpService.getNavConfig('assets/reports/BuildingList.json');
    if(config){
      ////console.log(config)
      this.buildingList = config.building;
      this.buildingList.push(this.overallSelected);
      this.buildingList.sort((a, b) => parseInt(b.no) - parseInt(a.no));
    }
    this.reportConfig = await this.httpService.getConfig('assets/reports/report[overall].config.json');
  }

  onDateTimeChange(event: any) {
    this.dateTime = event;
    this.resetTable();
    //this.initHolidays();
    switch(this.selectedReport.Type){
      case "daily":
        this.dateColumn = [];
        this.startTime = this.dateTimeService.getDateTime(this.dateTime);
        const endD = this.dateTime.setHours(23,59,0,0);
        this.endTime = this.dateTimeService.getDateTime(new Date(endD));
        let startHour = this.dateTime.getTime()+(60*1000);
        let endHour = startHour+(24*60*60*1000);
        let hourRate = 60*60*1000;
        for (let dt = startHour; dt < endHour; dt = dt+hourRate) {
            let newDate = new Date(dt).getTime() - (24*60*60*1000);
            this.dateColumn.push(new Date(newDate));
        }
        break;
      case "monthly":
        this.dateColumn = [];
        this.startTime = this.dateTimeService.getDateTime(this.dateTime);
        let endDate = new Date(this.dateTime);
        endDate.setMonth(endDate.getMonth() + 1, 1);
        this.endTime = this.dateTimeService.getDateTime(endDate);
        let startDay = this.dateTime.getTime(); 
        let endDay = new Date(this.endTime).getTime();
        let dayRate = 24 * 60 * 60 * 1000; 
        for (let dt = startDay; dt < endDay; dt += dayRate) {
            let newDate = new Date(dt);
            this.dateColumn.push(newDate);
        }
        break;
      case "yearly":
        this.dateColumn = [];
        this.startTime = this.dateTimeService.getDateTime(this.dateTime.toISOString());
        let endMonth = new Date(this.dateTime);
        endMonth.setFullYear(endMonth.getFullYear(), 12, 1);
        this.endTime = this.dateTimeService.getDateTime(endMonth);
        for (let dt = 1; dt <= 12; dt++) {
            let newDate = new Date(this.startTime).setMonth(dt-1, 1);
            this.dateColumn.push(new Date(newDate));
        }
        break;
    }
    //this.getRequestData();
  }


  getGroupRequestWithType(type: string, time: Date, index: number){
    let start: string = "";
    let end: string = "";
    switch(type){
      case 'daily':
        start = new Date(time).toISOString();
        const endD = time.getTime() + (60*60*1000);
        end = new Date(endD).toISOString();
        break;
      case 'monthly':
        const startM = time.setHours(0,0,0,0)
        start = new Date(startM).toISOString();
        const endM = time.setHours(23,59,0,0);
        end = new Date(endM).toISOString();
        break;
      case 'yearly':
        const firstD = time.setDate(1);
        const firstH = time.setHours(0,0,0,0);
        start = new Date(firstH).toISOString();//this.dateTimeService.getDateTime(new Date(startY));
        const endY = time.setMonth(time.getMonth()+1, 0);
        const lastDate = new Date(endY).setHours(23,59,59,0)
        end = new Date(lastDate).toISOString();;//this.dateTimeService.getDateTime(new Date(lastDate));
        break;
    }
    ////console.log('start : '+start+'\nend : '+end);
    const req: DashboardReqHistorian[] = this.selectedReport.HeaderGroup[index].Header.reduce((acc, cur) => {
      if(cur.tagname && !acc.find(x => x.Name == cur.tagname)){
        let reqItem: DashboardReqHistorian = {
          Name: cur.tagname,
          Options: {
            Time: "",
            StartTime: start,
            EndTime: end
          }
        };
        acc.push(reqItem);
      }
      return acc;
    },[]);
    return req;
  }

  async getResponseData(){
  
    this.resetTable();
    let index = 0;
    for await (const item of this.selectedReport.HeaderGroup) {
      this.loading = true;
      const fetchData = async () => {
        let table: any[] = [];
        const promises = this.dateColumn.map(async rw => {
          const res:DashboardResHistorian[] = await this.httpService.getReportData(this.getGroupRequestWithType(this.selectedReport.Type, rw, index));
          //console.log(item);
          //console.log(this.selectedReport.Type)
          //console.log(this.dateColumn)
          const testBody = this.getGroupRequestWithType(this.selectedReport.Type, rw, index);
          //console.log(testBody)
          this.response = res;        
          let row: string[] = [];
          item.Header.forEach((cl, i) => {
            switch (cl.option) {
              case "TIME":
                ////console.log(new Date(rw))
                row.push(new Date(rw).toISOString());
                break;
              case "DIFF":
                row.push(this.getDiffValue(cl.tagname, rw, res));
                break;
              case "MAX":
                row.push(this.getMaxValue(cl.tagname, rw, res));
                break;
              case "AVG":
                row.push(this.getAverageValue(cl.tagname, rw, res));
                break;
              case "ONPEAK":
                row.push(this.getDiffPeakValue(cl.tagname, rw, res));
                break;
              case "OFFPEAK":
                let diff = parseFloat(row[1]) - parseFloat(row[2]);
                row.push(diff.toString());
                break;
              case "SUMMAX":
                row.push(this.getSumMaxValue(cl.tagname, rw, res));
                break;
              case "AVGALL":
                row.push(this.getAverageAllValue(cl.tagname, rw, res));
                break;
              case "PEAKMONTH":
                row.push(this.getDiffValueForMonth(cl.tagname, res));
                break;
              default:
                row.push("0.00");
                break;
            }
          });
          table.push(row);
        });
        await Promise.all(promises);
        ////console.log(table)
        let sortingData =  table.sort((a, b) => new Date(a[0]).getHours() - new Date(b[0]).getHours());
        // const tableData: TableGroupModel = {
        //   table: sortingData,
        //   chart: this.gteChart(sortingData, item.Header[0].type, item.Header[0].tagname),
        //   name: item.Name
        // };
        // if(tableData){
        //   ////console.log(tableData);
        //   this.dataGroupTable.push(tableData);
        // }
      };
      await fetchData();
      index++;
    }
    ////console.log(this.dataGroupTable)
    this.loading = false;
  }

  getDiffValue(tag: string, date: Date, response: DashboardResHistorian[]){
    let res: string = "0.00";
    // const dateTime = date.getTime() - (7*60*60*1000);
    // let findDate = this.dateTimeService.getDateTime(new Date(dateTime)).substring(0,13)
    // if(this.selectedReport.Type == "monthly"){ findDate = this.dateTimeService.getDateTime(new Date(dateTime)).substring(0,11) }
    // else if(this.selectedReport.Type == "yearly"){ findDate = this.dateTimeService.getDateTime(new Date(dateTime)).substring(0,8) }
    const tags = this.response.find(x => x.Name == tag);
    // //console.log(tags)
    if(tags && tags.records){
      const data:Record[] = tags.records
      //.filter(d => d.TimeStamp.includes(findDate))
        .sort((a,b) => new Date(a.TimeStamp).getTime() - new Date(b.TimeStamp).getTime());
      const firstVal = data[this.findFirstValueIndex(data)];
      const lastVal = data[this.findLastValueIndex(data)];
      if(firstVal && lastVal && firstVal.Value && lastVal.Value){
        const diff = parseFloat(lastVal.Value) -  parseFloat(firstVal.Value);
        if(diff >= 0){res = diff.toString();}
      }
    }
    return res;
  }

  findFirstValueIndex(data: Record[]): number{
    for (let index = 0; index < data.length; index++) {
      let val = data[index].Value;
      if(parseFloat(val)){
        return index;
      }
    }
    return 0;
  }

  findLastValueIndex(data: Record[]): number{
    for (let index = data.length - 1; index >= 0; index--) {
      let val = data[index].Value;
      if(parseFloat(val)){
        return index;
      }
    }
    return data.length - 1;
  }

  getDiffPeakValue(tag: string, date: Date, response: DashboardResHistorian[]){
    let res: string = "0.00";
    const data:Record[] = this.response.find(x => x.Name == tag).records
      .filter(d => 
          new Date(this.dateTimeService.getDateTime(new Date(d.TimeStamp))).getHours() >= 9 &&  
          new Date(this.dateTimeService.getDateTime(new Date(d.TimeStamp))).getHours() <= 22 && 
          !new Date(this.dateTimeService.getDateTime(new Date(d.TimeStamp))).toString().startsWith('Sat') &&
          !new Date(this.dateTimeService.getDateTime(new Date(d.TimeStamp))).toString().startsWith('Sun') && 
          !this.holiday.find(x => x.substring(0, 11) == this.dateTimeService.getDateTime(new Date(d.TimeStamp)).substring(0, 11))
        )
        .sort((a,b) => new Date(a.TimeStamp).getTime() - new Date(b.TimeStamp).getTime());
    const firstVal = data[this.findFirstValueIndex(data)];
    const lastVal = data[this.findLastValueIndex(data)];
    if(firstVal && lastVal && firstVal.Value && lastVal.Value){
      const diff = parseFloat(lastVal.Value) -  parseFloat(firstVal.Value);
      if(diff >= 0){res = diff.toString();}
    }
    return res;
  }

  getDiffOffPeakValue(tag: string, date: Date){
    let res: string = "0.00";
    const dateTime = date.getTime() - (7*60*60*1000);
    let findDate = this.dateTimeService.getDateTime(new Date(dateTime)).substring(0,13)
    if(this.selectedReport.Type != "daily"){ findDate = this.dateTimeService.getDateTime(new Date(dateTime)).substring(0,11) }
    const data:Record[] = this.response.find(x => x.Name == tag).records
      .filter(d => d.TimeStamp.includes(findDate) && new Date(this.dateTimeService.getDateTime1(new Date(d.TimeStamp))).getHours() < 9 &&  new Date(this.dateTimeService.getDateTime1(new Date(d.TimeStamp))).getHours() > 18)
        .sort((a,b) => new Date(a.TimeStamp).getTime() - new Date(b.TimeStamp).getTime());
    const firstVal = data[0];
    const lastVal = data[data.length - 1];
    if(firstVal && lastVal && firstVal.Value && lastVal.Value){
      const diff = parseFloat(lastVal.Value) -  parseFloat(firstVal.Value);
      if(diff >= 0){res = diff.toString();}
    }
    return res;
  }

  getAverageValue(tag: string, date: Date, response: DashboardResHistorian[]){
    let res: string = "0.00";
    const dateTime = date.getTime() - (7*60*60*1000);
    let findDate = this.dateTimeService.getDateTime(new Date(dateTime)).substring(0,13)
    if(this.selectedReport.Type != "daily"){ findDate = this.dateTimeService.getDateTime(new Date(dateTime)).substring(0,11) }
    const data:Record[] = this.response.find(x => x.Name == tag).records
      .filter(d => d.TimeStamp.includes(findDate));
    const avgVal = data.reduce((acc, cur) => {
      acc += parseFloat(cur.Value);
      return acc;
    },0);
    if(avgVal){
      const diff = avgVal/data.length;
      if(diff >= 0){res = diff.toString();}
    }
    return res;
  }

  getAverageAllValue(tag: string, date: Date, response: DashboardResHistorian[]){
    let res: string = "0.00";
    const data:Record[] = this.response.find(x => x.Name == tag).records;
    const avgVal = data.reduce((acc, cur) => {
      acc += parseFloat(cur.Value);
      return acc;
    },0);
    if(avgVal){
      const diff = avgVal/data.length;
      if(diff >= 0){res = diff.toString();}
    }
    return res;
  }

  getMaxValue(tag: string, date: Date, response: DashboardResHistorian[]){
    let res: string = "0.00";
    const dateTime = date.getTime() - (7*60*60*1000);
    let findDate = this.dateTimeService.getDateTime(new Date(dateTime)).substring(0,13)
    if(this.selectedReport.Type != "daily"){ findDate = this.dateTimeService.getDateTime(new Date(dateTime)).substring(0,11) }
    const data:Record[] = this.response.find(x => x.Name == tag).records
      .filter(d => d.TimeStamp.includes(findDate))
        .sort((a,b) => parseFloat(a.Value) - parseFloat(b.Value));
    const lastVal = data[data.length - 1];
    if(lastVal && lastVal.Value){
      const diff = parseFloat(lastVal.Value);
      if(diff >= 0){res = diff.toString();}
    }
    return res;
  }

  getSumMaxValue(tag: string, date: Date, response: DashboardResHistorian[]){
    let res: string = "0.00";
    const data: DashboardResHistorian = this.response.find(x => x.Name == tag);
    const sumValue = this.getMaxValueForEachDate(data.records)
      .reduce((acc, cur) => {
        acc += parseFloat(cur.Value);
        return acc;
      }, 0);
    if(sumValue){
      res = sumValue.toString();
    }
    return res;
  }

  getMaxValueForEachDate(records: Record[]): Record[] {
    const groupedByDate: { [key: string]: Record[] } = {};
  
    records.forEach(record => {
      const date = record.TimeStamp.split('T')[0];
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
      groupedByDate[date].push(record);
    });
  
    const maxValuesForEachDate: Record[] = Object.keys(groupedByDate).map(date => {
      const recordsForDate = groupedByDate[date];
      const maxRecord = recordsForDate.reduce((max, record) => {
        return parseFloat(record.Value) > parseFloat(max.Value) ? record : max;
      }, recordsForDate[0]);
      return maxRecord;
    });
  
    return maxValuesForEachDate;
  }

  getDiffValueForMonth(tag: string, response: DashboardResHistorian[]) {
    const tags = this.response.find(x => x.Name == tag);
    const groupedByDate: { [key: string]: Record[] } = {};
    if(tags && tags.records){
      tags.records.forEach(record => {
        const rec:Record = {
          Value: record.Value,
          TimeStamp: this.dateTimeService.getDateTime(new Date(record.TimeStamp))
        } ;
        const date = rec.TimeStamp.split('T')[0];
        if (!groupedByDate[date]) {
          groupedByDate[date] = [];
        }
        groupedByDate[date].push(rec);
      });
    }
    let diffVal: number = 0;
    const maxValuesForEachDate = Object.keys(groupedByDate).map(date => {
      const recordsForDate = groupedByDate[date];
      const maxRecord = recordsForDate.filter(d =>
          new Date(this.dateTimeService.getDateTime1(new Date(d.TimeStamp))).getHours() >= 9 &&  
          new Date(this.dateTimeService.getDateTime1(new Date(d.TimeStamp))).getHours() <= 22 && 
          !new Date(this.dateTimeService.getDateTime1(new Date(d.TimeStamp))).toString().startsWith('Sat') &&
          !new Date(this.dateTimeService.getDateTime1(new Date(d.TimeStamp))).toString().startsWith('Sun') && 
          !this.holiday.find(x => x.substring(0, 11) == this.dateTimeService.getDateTime(new Date(d.TimeStamp)).substring(0, 11))
      ).sort((a,b) => new Date(a.TimeStamp).getTime() - new Date(b.TimeStamp).getTime());
      const firstVal = maxRecord[this.findFirstValueIndex(maxRecord)];
      const lastVal = maxRecord[this.findLastValueIndex(maxRecord)];
      if(firstVal && lastVal && firstVal.Value && lastVal.Value){
        const diff = parseFloat(lastVal.Value) -  parseFloat(firstVal.Value);
        if(diff >= 0){diffVal += diff}
      }
      return maxRecord;
    });
    
  
    return diffVal.toString();
  }

  getMaxValueRecord(record: Record[]): Record[] {
      const maxValues = {};
      record.forEach(record => {
        const TimeStamp = record.TimeStamp;
        const value = parseFloat(record.Value);

        if (!maxValues[TimeStamp] || value > parseFloat(maxValues[TimeStamp].Value)) {
          maxValues[TimeStamp] = {...record,Value:value.toString() };
        }
      });
      const maxRecords: Record[] = Object.values(maxValues)
      return  maxRecords;
  }
  
  getSummaryData(type: string, index: number, factor: number, data: any[]){
    let res: string = "0.00";
    ////console.log(data)
    if(data && data.length > 0){
      switch(type){
        case "SUM":
          const sum = data.reduce((acc, cur) => {
            acc += parseFloat(cur[index]);
            return acc;
          },0);
          if(sum){
            res = (sum*factor).toString();
          }
          break;
        case "AVG":
          const avg = data.reduce((acc, cur) => {
            acc += parseFloat(cur[index]);
            return acc;
          },0);
          if(avg){
            res = ((avg/data.length)*factor).toString();
          }
          break;
      }
    }
    return res;
  }

  getStartView(type: string) {
    if (type === 'daily') {
      return null;
    }
    else if(type === 'monthly') {
      return 'year';
    }
    else if(type === 'yearly') {
      return 'multi-years';
    }
  } 

  resetTable(){
    this.dataTable = [];
    this.dataGroupTable = [];
  }

  delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  htmltoPDF2() {
    this.downloadTxt = true;
    const chart = document.getElementById('htmlTable') as HTMLElement;
    const reportName =
      this.siteSelected.name +
      " " +
      this.selectedReport.Name +
      "[" +
      this.datePipe.transform(this.dateTime, this.selectedReport.DateFormat) +
      "]" +
      ".pdf";
  
    const docDefinition: any = {
      content: [],
    };

    // Ensure full table visibility before capturing
    const originalOverflow = chart.style.overflow;
    chart.style.overflow = 'visible';
    chart.style.width = '100%';
  
    html2canvas(chart, {scale: 1}).then((canvas) => {
      const croppedCanvas = document.createElement('canvas');
      const context = croppedCanvas.getContext('2d');

      const promises = this.selectedReport.HeaderGroup.map((item, index) => {
        return new Promise<void>((resolve) => {
          let cropX = 0;
          let cropY = index * 1200;
          let cropWidth = 794;
          let cropHeight = 1200;
  
          croppedCanvas.width = 794;
          croppedCanvas.height = 1200;
  
          context.drawImage(
            canvas,
            cropX,
            cropY,
            cropWidth,
            cropHeight,
            0,
            0,
            cropWidth,
            cropHeight
          );
          const base64Image = croppedCanvas.toDataURL(); 
          docDefinition.content.push({
            image: base64Image,
            width: 525,
            alignment: 'center',
            pageBreak: 'after',
          });
  
          resolve(); 
        });
      });
  
      Promise.all(promises).then(() => {
        pdfMake.createPdf(docDefinition).download(reportName);
        this.downloadTxt = false;
      });
    });
  }

  saveCanvasToImage(canvas: HTMLCanvasElement, filename: string = 'image.png') {
    // Create a download link
    const link = document.createElement('a');
    
    // Convert canvas to data URL
    const imageDataUrl = canvas.toDataURL('image/png');
    
    // Set download attributes
    link.download = filename;
    link.href = imageDataUrl;
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // async htmltoPDF() {
  //   //this.htmltoPDF2();
  //   this.downloadTxt = true;
  //   const componentIds = this.selectedReport.HeaderGroup;
  //   const reportName = this.siteSelected.id + " " + this.selectedReport.Name + "[" + 
  //     this.datePipe.transform(this.dateTime, this.selectedReport.DateFormat) + "]" + ".pdf";
  
  //   const pdf = new jsPDF('p', 'mm', 'a4');
  //   const docDefinition: any = {
  //     content: [],
  //   };
  //   const imgArr = [];

  //   const chart = document.getElementById('htmlTable') as HTMLElement;
  //   const chartElements = chart.getElementsByClassName('report-content') as HTMLCollectionOf<Element>;
    
  //   Array.from(chartElements).forEach((element: HTMLElement, index) => {
  //     // Use html2canvas to capture each element as an image
  //       html2canvas(element).then((canvas) => {
  //           const dataURL = 'c'//canvas.toBlob()
  //           //console.log(`Chart ${index + 1} as Data URL:`, canvas.nodeName);
  //           // docDefinition.content.push({
  //           //   image: dataURL,
  //           //   width: 525,
  //           //   alignment: 'center',
  //           //   pageBreak: 'after' 
  //           // });
  //           // Optionally append the canvas to the document to visualize
  //           //document.body.appendChild(canvas); // For testing purposes
  //       }).catch((error) => {
  //           //console.error(`Error generating Data URL for chart ${index + 1}:`, error);
  //       });
  //   });
    
  //   const captureComponent = async (componentId: string) => {
  //     const chart = document.getElementById(componentId) as HTMLElement;
  //     if (chart) {
  //       const canvas = await html2canvas(chart, { scale: 1, useCORS: true, logging: false,} );
  //       if(canvas){
  //         const imgData = canvas.toBlob((blob) => {},"image/png", 1.0)//canvas.toDataURL("image/jpeg", 1.0);
  //         const imgWidth = 208;
  //         const imgHeight = canvas.height * imgWidth / canvas.width;
  //         //console.log(imgData)
  //       }
  
  //       // docDefinition.content.push({
  //       //   image: imgData,
  //       //   width: 525,
  //       //   alignment: 'center',
  //       //   pageBreak: 'after' 
  //       // });
  //       // const definition = {
  //       //   content: [
  //       //     {
  //       //       image: imgData,
  //       //       width: 525,
  //       //       alignment: 'center',
  //       //       pageBreak: 'after' 
  //       //     }
  //       //   ]
  //       // };
  //       // const createPDF = pdfMake.createPdf(definition).getBase64( async(data: any) => {
  //       //   // const pdf = await PDFDocument.load(data);
  //       //   // const copyPdf = await mergePDF.copyPages(pdf, pdf.getPageIndices());
  //       //   // copyPdf.forEach((page) => mergePDF.addPage(page));
  //       //   //console.log(data)
  //       // });
  //       //pdfMake.createPdf(definition).download(componentId+'.pdf');
  //     }
  //     // await this.delay(100);
  //   };
  
  //   // for await (const id of componentIds) {
  //   //   await captureComponent(id.Name);
  //   //   await this.delay(1000);
  //   // }
  //   // const savePDF = await mergePDF.save();
  //   // if(savePDF){
  //   //   alert('save pdf')
  //   // }
  //   // pdfMake.createPdf(docDefinition).download(reportName);
  //   // const createPDF = pdfMake.createPdf(docDefinition).getBase64( async(data: any) => {
      
  //   //   //console.log(data)
  //   // });
  //   //pdfMake.createPdf(docDefinition).open();
  //   //console.log(docDefinition)
  //   this.downloadTxt = false;
  // }
  

  async selectSite(data:BuildingModel){
    this.siteSelected = data;
    this.siteName = data.id;
    this.resetTable();
    this.reportConfig = await this.httpService.getConfig('assets/reports/report['+data.id+'].config.json');
    if(this.reportConfig){
      this.initReportSelect();
    }

  }

  async selectOverall(){
    this.siteSelected = {
			no:"0",
			id:"Overall",
			zone:"Overall",
			name:"Overall",
			capacity: 6364,
			display: true,
			building: []
		};
    this.siteName = 'overall';
    this.resetTable();
    this.reportConfig = await this.httpService.getConfig('assets/reports/report[overall].config.json');
    if(this.reportConfig){
      this.initReportSelect();
    }

  }

  
  exportToExcel(): void {
    if (!this.selectedReport || !this.selectedReport.HeaderGroup || this.selectedReport.HeaderGroup.length === 0 || this.dataGroupTable.length === 0) {
      alert('Please select a valid report!');
      return;
    }
    const workbook: XLSX.WorkBook = { Sheets: {}, SheetNames: [] };
    const reportName = `${this.siteSelected.id} ${this.selectedReport.Name}[${this.datePipe.transform(this.dateTime, this.selectedReport.DateFormat)}]`;
    this.selectedReport.HeaderGroup.forEach((group, groupIndex) => {
      const headers: string[] = [];
      const rows: any[] = [];
      group.Header.forEach(record => {
        headers.push(record.title);
      });
      this.dataGroupTable[groupIndex].table.forEach(item => {
        const row = [];
        group.Header.forEach((header, i) => {
          if (header.type === 'date') {
            row.push(this.datePipe.transform(item[i], header.type));
          } else {
            row.push(item[i]);
          }
        });
        rows.push(row);
      });
      const sheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      const sheetName = group.Name || `Sheet${groupIndex + 1}`;
      workbook.Sheets[sheetName] = sheet;
      workbook.SheetNames.push(sheetName);
    });
  
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, reportName);
  }
  

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = window.URL.createObjectURL(data);
    link.download = fileName + '.xlsx';
    link.click();
  }

  async getResponseData2(){
  
    // this.resetTable();
    // this.loading = true;
    // this.renderReport = this.selectedReport;
    // for await (const item of this.selectedReport.HeaderGroup) {
    //   const req:ReportRequestModel = {
    //     Name: item.Name,
    //     Type: this.selectedReport.Type,
    //     Header: item.Header,
    //     DateColumn: this.dateColumn,
    //     StartTime: this.dateTimeService.getDateTime(new Date(this.dateTime.getFullYear(), 0, 1)),
    //     EndTime: this.dateTimeService.getDateTime(new Date(this.dateTime.getFullYear(), 11, 31))
    //   };
    //   const response = await this.httpService.getCompleteReportData(req);
    //   if(response){
    //     const tableData: TableGroupModel = {
    //       table: response,
    //       chart: this.gteChart(response, item.Header[0].type, item.Header[0].tagname),
    //       name: item.Name
    //     };
    //     this.dataGroupTable.push(tableData);
    //   }
    // }
    // this.loading = false;
    const checkdate = new Date()
    checkdate.setHours(0,0,0,0);
    const reportDate = new Date(this.dateTime);
    reportDate.setHours(0,0,0,0);
    const reportId = this.siteName+this.selectedReport.Type+this.dateTime.toISOString();
    const reportDataTable:TableGroupModel[] = [];
    ////console.log('report time : ' + reportDate.getTime() + " : " + reportDate.toISOString());
    ////console.log('date time : ' + checkdate.getTime() + " : " + checkdate.toISOString());
    if(reportId != this.oldReportData){
      this.oldReportData = reportId;
      this.loading = true;
      ////console.log('new data')
      this.dataGroupTable = [];
      this.renderReport = this.selectedReport;
      const report = this.renderReport.HeaderGroup.map( async(item, index) => {
        const req:ReportRequestModel = {
          Name: item.Name,
          Type: this.renderReport.Type,
          Header: item.Header,
          DateColumn: this.dateColumn,
          StartTime: this.dateTimeService.getDateTime(new Date(this.dateTime.getFullYear(), 0, 1)),
          EndTime: this.dateTimeService.getDateTime(new Date(this.dateTime.getFullYear(), 11, 31))
        };
        const response = await this.httpService.getCompleteReportData(req);
        if(response){
          const tableData: TableGroupModel = {
            table: response,
            chart: this.gteChart(response, item.Header[0].type, item.Header[0].tagname),
            name: item.Name,
            dateformat: this.renderReport.DateFormat,
            title: this.renderReport.Name,
            header: item.Header
          };
          reportDataTable[index] = tableData;
        }
      });
      await Promise.all(report);
      this.dataGroupTable = reportDataTable;
      this.loading = false;
    } else if( reportDate.getTime() >= checkdate.getTime()){
      this.oldReportData = reportId;
      this.loading = true;
      ////console.log('new data')
      this.dataGroupTable = [];
      this.renderReport = this.selectedReport;
      const report = this.renderReport.HeaderGroup.map( async(item, index) => {
        const req:ReportRequestModel = {
          Name: item.Name,
          Type: this.renderReport.Type,
          Header: item.Header,
          DateColumn: this.dateColumn,
          StartTime: this.dateTimeService.getDateTime(new Date(this.dateTime.getFullYear(), 0, 1)),
          EndTime: this.dateTimeService.getDateTime(new Date(this.dateTime.getFullYear(), 11, 31))
        };
        const response = await this.httpService.getCompleteReportData(req);
        if(response){
          const tableData: TableGroupModel = {
            table: response,
            chart: this.gteChart(response, item.Header[0].type, item.Header[0].tagname),
            name: item.Name,
            dateformat: this.renderReport.DateFormat,
            title: this.renderReport.Name,
            header: item.Header
          };
          reportDataTable[index] = tableData;
        }
      });
      await Promise.all(report);
      this.dataGroupTable = reportDataTable;
      this.loading = false;
    } else {
      // const oldTable = this.dataGroupTable;
      // this.dataGroupTable = [];
      // this.dataGroupTable = oldTable;
    }
    //console.log(this.dataGroupTable)
  }

  resetLoading(){
    //console.log('2222')
    this.loading = false;
    //return 'xxx';
  }

  itemByName(item: TableGroupModel, index: number){
    return item.name;
  }
  
}

export interface ReportConfigModel{
  Name: string;
  Type: string;
  DateFormat: string;
  ExchangeRate: number;
  Co2Rate: number;
  OilRate: number;
  TreeRate: number;
  Header?: ReportHeaderModel[];
  HeaderGroup?: HeaderGroupModel[];
  ChartConfig?: DashboardConfigStateModel;
}

export interface HeaderGroupModel{
  Name: string;
  Header: ReportHeaderModel[];
}

export interface ReportHeaderModel{
  title: string;
  tagname: string;
  option: string;
  width: string;
  type: string;
  factor: number;
  display?: string;
}

export interface TableGroupModel{
  table: string[][];
  chart: Chart;
  name: string;
  dateformat: string;
  title: string;
  header: ReportHeaderModel[];
}