import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  startView: string;
  currentRoute: string;
  siteName: string = ''; 
  siteSelected: BuildingModel;
  buildingList: BuildingModel[] = [];
  sub1: Subscription;
  startTime: string;
  endTime: string;
  request: DashboardReqHistorian[] = [];
  response: DashboardResHistorian[] = [];
  dateColumn: Date[] = [];
  dataTable: any[][] = [];
  chartParameters: ChartParameters;
  uuid: string;
  chart: Chart;
  loading: boolean = false;
  holiday: string[] = [];

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
    this.dateTime = new Date(new Date().setDate(new Date().getDate()-1));
    await this.getConfig();
    this.initReportSelect();
    this.initSiteSelect();
  }

  updateChart(){
    const orderPipe = new OrderByPipe();
    this.chart = new Chart({
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
        categories: orderPipe.transform(this.dataTable, 0).map(x => this.datePipe.transform(x[0], this.selectedReport.Header[0].type))
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
          name: 'Energy Peak',
          data: orderPipe.transform(this.dataTable, 0).map(x => parseFloat(x[2])),
          color: '#F05C5C'
        },
        {
          name: 'Energy Offpeak',
          data: orderPipe.transform(this.dataTable, 0).map(x => parseFloat(x[3])),
          color: '#0DD141'
        }
      ]
    });
    this.cd.markForCheck();
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
  }

  initReportSelect() {
    if (this.reportConfig.length > 0) {
      this.selectedReport = this.reportConfig[0];
    }
    const date = new Date();
    date.setDate(2);
    this.holiday.push(this.dateTimeService.getDateTime(new Date(date)));
    console.log(this.holiday)
  }

  initSiteSelect() {
    if (this.buildingList.length > 0) {
      this.siteSelected = this.buildingList[0];
      this.siteName = this.buildingList[0].id;
    }
  }

  async getConfig() {
    const config: SiteStateModel = await this.httpService.getNavConfig('assets/main/BuildingList.json');
    if(config){
      config.building.sort((a,b) => parseInt(a.no) - parseInt(b.no));
      this.buildingList = config.building;
    }
    this.reportConfig = await this.httpService.getConfig('assets/reports/report.config2.json');
  }

  onDateTimeChange(event) {
    this.dateTime = event;
    this.dataTable = [];
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
    this.getRequestData();
  }

  getRequestData(){
    if(this.selectedReport.Header){
      const req: DashboardReqHistorian[] = this.selectedReport.Header.reduce((acc, cur) => {
        if(cur.tagname && !acc.find(x => x.Name == cur.tagname)){
          let reqItem: DashboardReqHistorian = {
            Name: cur.tagname,
            Options: {
              Time: "",
              StartTime: this.startTime,
              EndTime: this.endTime
            }
          };
          acc.push(reqItem);
        }
        return acc;
      },[]);
      if(req){this.request = req;}
    }
  }

  getRequestWithType(type: string, time: Date){
    let start: string = "";
    let end: string = "";
    switch(type){
      case 'daily':
        // start = this.dateTimeService.getDateTime(time);
        // const endD = time.getTime() + (60*60*1000);
        // end = this.dateTimeService.getDateTime(new Date(endD));
        // const startM = time.setHours(0,0,0,0)
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
        start = this.dateTimeService.getDateTime(time);
        const endY = time.setMonth(time.getMonth()+1, 0);
        const lastDate = new Date(endY).setHours(23,59,59,0)
        end = this.dateTimeService.getDateTime(new Date(lastDate));
        break;
    }
    const req: DashboardReqHistorian[] = this.selectedReport.Header.reduce((acc, cur) => {
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
    const table: any[] = [];

    const fetchData = async () => {
      this.dataTable = [];
      this.loading = true;
      const promises = this.dateColumn.map(async rw => {
        const res:DashboardResHistorian[] = await this.httpService.getHistorian(this.getRequestWithType(this.selectedReport.Type, rw));
        this.response = res;        
        let row: any[] = [];
        this.selectedReport.Header.forEach((cl, i) => {
          switch (cl.option) {
            case "TIME":
              row.push(rw);
              break;
            case "DIFF":
              row.push(this.getDiffValue(cl.tagname, rw));
              break;
            case "MAX":
              row.push(this.getMaxValue(cl.tagname, rw));
              break;
            case "AVG":
              row.push(this.getAverageValue(cl.tagname, rw));
              break;
            case "ONPEAK":
              row.push(this.getDiffPeakValue(cl.tagname, rw));
              break;
            case "OFFPEAK":
              let diff = parseFloat(row[1]) - parseFloat(row[2]);
              row.push(diff.toString());
              break;
            case "SUMMAX":
              row.push(this.getSumMaxValue(cl.tagname, rw));
              break;
            case "AVGALL":
              row.push(this.getAverageAllValue(cl.tagname, rw));
              break;
            case "PEAKMONTH":
              row.push(this.getDiffValueForMonth(cl.tagname));
              break;
            default:
              row.push("0.00");
              break;
          }
        });
        table.push(row);
      });
      await Promise.all(promises);
      this.loading = false;
      this.dataTable = table.sort((a, b) => new Date(a[0]).getHours() - new Date(b[0]).getHours());
      if (this.dataTable) {
        this.updateChart();
      }
    };
    fetchData();
  }

  getDiffValue(tag: string, date: Date){
    let res: string = "0.00";
    // const dateTime = date.getTime() - (7*60*60*1000);
    // let findDate = this.dateTimeService.getDateTime(new Date(dateTime)).substring(0,13)
    // if(this.selectedReport.Type == "monthly"){ findDate = this.dateTimeService.getDateTime(new Date(dateTime)).substring(0,11) }
    // else if(this.selectedReport.Type == "yearly"){ findDate = this.dateTimeService.getDateTime(new Date(dateTime)).substring(0,8) }
    const tags = this.response.find(x => x.Name == tag);
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

  getDiffPeakValue(tag: string, date: Date){
    let res: string = "0.00";
    // const dateTime = date.getTime() - (7*60*60*1000);
    // let findDate = this.dateTimeService.getDateTime(new Date(dateTime)).substring(0,13)
    // if(this.selectedReport.Type != "daily"){ findDate = this.dateTimeService.getDateTime(new Date(dateTime)).substring(0,11) }
    const data:Record[] = this.response.find(x => x.Name == tag).records
      .filter(d => 
          new Date(this.dateTimeService.getDateTime(new Date(d.TimeStamp))).getHours() >= 9 &&  
          new Date(this.dateTimeService.getDateTime(new Date(d.TimeStamp))).getHours() <= 18 && 
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

  getAverageValue(tag: string, date: Date){
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

  getAverageAllValue(tag: string, date: Date){
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

  getMaxValue(tag: string, date: Date){
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

  getSumMaxValue(tag: string, date: Date){
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

  getDiffValueForMonth(tag: string) {
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
          new Date(this.dateTimeService.getDateTime1(new Date(d.TimeStamp))).getHours() <= 18 && 
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
  
  getSummaryData(type: string, index: number, factor: number){
    let res: string = "0.00";
    switch(type){
      case "SUM":
        const sum = this.dataTable.reduce((acc, cur) => {
          acc += parseFloat(cur[index]);
          return acc;
        },0);
        if(sum){
          res = (sum*factor).toString();
        }
        break;
      case "AVG":
        const avg = this.dataTable.reduce((acc, cur) => {
          acc += parseFloat(cur[index]);
          return acc;
        },0);
        if(avg){
          res = ((avg/this.dataTable.length)*factor).toString();
        }
        break;
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
  }

  htmltoPDF(){
    const chart = document.getElementById('htmlTable') as HTMLElement;
    const reportName = this.siteSelected.id + " " + this.selectedReport.Name + "[" + this.datePipe.transform(this.dateTime, this.selectedReport.DateFormat) + "]" + ".pdf" 
    html2canvas(chart, { scale: 2 }).then(canvas => {
      const imgWidth = 208;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL("image/png", 1.0);

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(reportName);
    });
  }

  async selectSite(data:BuildingModel){
    this.siteSelected = data;
    this.siteName = data.id;
    this.resetTable();
    this.reportConfig = await this.httpService.getConfig('assets/reports/report['+data.id+'].config.json');
    if(this.reportConfig){
      this.initReportSelect();
    }

  }

  exportToExcel(): void {
    const headers: string[] = [];
    const rows:any[] = [];

    if(this.selectedReport && this.selectedReport.Header.length > 0 && this.dataTable.length > 0){
      this.selectedReport.Header.forEach(record => {
        headers.push(record.title);
      });
      this.dataTable.forEach((item, index)=> {
        const row = [this.datePipe.transform(item[0], this.selectedReport.Header[0].type)];
        item.forEach( (x, i) => {
          if(i > 0){row.push(x);}
        });
        rows.push(row);
      })
      const reportName = this.siteSelected.id + " " + this.selectedReport.Name + "[" + this.datePipe.transform(this.dateTime, this.selectedReport.DateFormat) + "]"
      const sheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      const workbook: XLSX.WorkBook = { Sheets: { 'data': sheet }, SheetNames: ['data'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, reportName);
    } else {
      alert('please select report!');
    }
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = window.URL.createObjectURL(data);
    link.download = fileName + '.xlsx';
    link.click();
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
  Header: ReportHeaderModel[];
  ChartConfig?: DashboardConfigStateModel;
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
