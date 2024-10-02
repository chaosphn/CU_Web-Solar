import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngxs/store';
import { UUID } from 'angular2-uuid';
import { Subscription, timer } from 'rxjs';
import { DashboardLastValuesStateModel, DashboardResHistorian, ItemParameters, Record } from '../core/stores/last-values/dashboard/dashboard-last-values.model';
import { TagsStateModel } from '../core/stores/tags/tags.model';
import { AddTags, TagsState } from '../core/stores/tags/tags.state';
import { MockDataService } from '../dashboard/services/mock-data.service';
import { DialogTagComponent } from '../share/components/dialog-tag/dialog-tag.component';
import { PeriodGroup, PeriodTime } from '../share/models/period-time';
import { ResponseData } from '../share/models/response-data.model';
import { ChartParameters, HAlign, LegendLayout, LegendParameter, Series, VAlingn, XAxisParameters, XAxisType } from '../share/models/sat-chart';
import { AliasItem, Group, TagGrouping, TagInfo } from '../share/models/tag-group.model';
import { ValueType } from '../share/models/value-models/value-type.model';
import { AppLoadService } from '../share/services/app-load.service';
import { DataRead } from './../share/models/data-read.model';
import { DateTimeService } from './../share/services/datetime.service';
import { HttpService } from './../share/services/http.service';
import { InverterReqHistorian } from '../core/stores/requests/inverter/inverter-request.model';
import { InverterResHistorian } from '../core/stores/last-values/inverter/inverter-last-values.model';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit, AfterViewInit {
  chartParameters: ChartParameters;
  reqCurrs: any[] = [];
  configs: TagGrouping[] = [];
  tagNames: string[] = [];
  startTime: Date;
  endTime: Date;
  startDate: string;
  endDate: string;
  periodName: string;
  periodNames = ['T', '7D', '30D', '3M', '12M'];
  periodGroup:PeriodGroup[] = [
    { Name: 'D', Type: 'daily' }, { Name: 'W', Type: 'weekly' }, { Name: 'M', Type: 'monthly' }, { Name: 'Y', Type: 'yearly' },
  ];
  periodGroupSelected: PeriodGroup;
  timerSubscription: Subscription;
  chartData: InverterResHistorian[] = [];
  downLoading: boolean = false;
  isPeriod: boolean = false;
  dateTime: Date;
  isInitialize: boolean = false;
  @ViewChild('htmlData', { read: false }) htmlData?: ElementRef
  uuid: string;
  constructor(public dialog: MatDialog,
    private store: Store,
    private mockDataService: MockDataService,
    private dateTimeService: DateTimeService,
    private appLoadService: AppLoadService,
    private httpService: HttpService) { }

  ngOnInit() {
    this.uuid = UUID.UUID();
    this.dateTime = new Date(new Date());
    this.initChart();
    this.getTagConfigs();
    this.initDateTime();
  }

  ngAfterViewInit(): void {
    this.isInitialize = true;
  }

  initChart() {
    const _config = new ChartParameters(this.uuid);
    const series: Series[] = [];
    const data: [number, number][] = [];
    data.push([new Date().getTime(), 0]);
    const serie: Series = {
      name: '',
      data: data,
      visible: false,
      showInLegend: false
    };
    const legend: LegendParameter = {
      legendEnable: true,
      lengendFloating: true,
      HorizontalAlign: HAlign.center,
      VerticalAlign: VAlingn.top,
      XPostion: 0,
      YPosition: -10,
  };

    series.push(serie);
    _config.addSeries(series);
    // _config.setLegend(legend);
    this.chartParameters = _config;
  }

  unsubscribe() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  async getTagConfigs() {
    const tagConfig: TagGrouping = {
      Category: "",
      Groups: [],
      Aliases: []
    }; 
    const req: string = await this.httpService.getConfigFile('assets/charts/tag-req.json');
    const config: TagInfo[] = await this.httpService.getTags(req);
    if(config){
      const Catagory = config.reduce((acc, curr)=>{
        const group = curr.Group
        acc[group] = acc[group] || [];
        acc[group].push(curr);
        return acc;
      }, {});
      // //console.log(Catagory);
      (Object.keys(Catagory) as (keyof typeof Catagory)[]).forEach((key, index) => {
        this.configs.push({
          Category: key,
          Groups: this.getGroup(Catagory[key]),
          Aliases: this.getAlias(Catagory[key])
        })
      });
    }
    ////console.log(this.configs);
  }

  getGroup(tags: TagInfo[]){
    const tagGroup: Group[] = [];
    let grpName = "";
    tags.forEach( (item , index) => {
      const invInfo = item.Name.split(".");
      if(invInfo[1] != grpName && !tagGroup.find(x => x.Display == invInfo[1])){
        tagGroup.push({
          Name: invInfo[0] + "." + invInfo[1],
          FullPath: item.Address,
          active: false,
          Display: invInfo[1],
        });
      }
      grpName = invInfo[1];
    }) 
    return tagGroup.filter(x => !x.Display.includes("ZONE"));
  }

  getAlias(tags: TagInfo[]){
    const tagGroup: AliasItem[] = [];
    let grpName = [];
    tags.forEach( (item , index) => {
      const invInfo = item.Name.split(".");
      const checkTag = grpName.find( x => x == invInfo[2]);
      if(!checkTag){
        tagGroup.push({
          Name: '(' + item.Unit + ')',
          active: false,
          Display: invInfo[2],
        });
      }
      grpName.push(invInfo[2]);
    }) 
    return tagGroup;
  }

  initDateTime() {
    // this.periodName = 't';
    this.periodGroupSelected = this.periodGroup[0];
    const period: PeriodTime = this.dateTimeService.parseDate('t');
    this.startTime = new Date(period.startTime);
    this.endTime = new Date(period.endTime);
  }

  selectTag() {

    const dialogRef = this.dialog.open(DialogTagComponent, {
      width: '100%',
      minWidth: '95%',
      minHeight: '95%',
      data: this.configs,
      backdropClass: 'dialog-backdrop',
      panelClass: ['dialog-panel']
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tagNames = result;
        //console.log(this.tagNames);
        if (this.tagNames.length === 0) {
          this.periodName = null;
        }
      }
    });
  }



  selectStartTime(newDate: Date) {
    this.startTime = newDate;
    this.periodName = null;
  }

  selectEndTime(newDate: Date) {
    this.endTime = newDate;
    this.periodName = null;
  }

  selectedPeriodGroup(periodName: PeriodGroup) {
    this.periodGroupSelected = periodName;
    //this.dateTime = new Date(new Date());
    this.dateTime = new Date();
    this.onDateTimeChange(this.dateTime);
    //console.log('start: '+this.startDate+'\nend: '+this.endDate);
    this.render(this.tagNames, this.startDate, this.endDate);
  }

  selectedPeriod(periodName: string) {
    if (this.checkTagNames()) {
      this.periodName = periodName;
      const period = this.dateTimeService.parseDate(periodName);
      this.startTime = new Date(period.startTime);
      this.endTime = new Date(period.endTime);
      this.render(this.tagNames, this.startTime, this.endTime);
    }
    else {
      this.periodName = null;
    }
  }

  checkTagNames(): boolean {
    if (this.tagNames.length === 0) {
      alert('Please select tags.');
      return false;
    }
    return true;
  }

  selectChart() {
    if(this.isPeriod){
      this.render(this.tagNames, this.startTime, this.endTime);
    } else {
      this.render(this.tagNames, this.startDate, this.endDate);
    }
  }

  setDateType() {
    this.isPeriod = !this.isPeriod;
  }

  async render(tagNames: string[], startTime: string | Date, endTime: string | Date) {
    this.validateParameters();
    this.downLoading = true;
    const st = this.dateTimeService.getDateTime(startTime);
    const ed = this.dateTimeService.getDateTime(endTime);
    this.reqCurrs = this.getReqDataConfig(tagNames ,st, ed);
    const res:DashboardResHistorian[] = await this.httpService.getReportData(this.reqCurrs);
    this.renderChart(this.getMaxValueRecord(res));
    if (this.periodName && this.periodName.toLowerCase() === 't') {
      //this.startTimer(this.appLoadService.Config.Timer * 1000 * 12);
    }
    else {
      this.unsubscribe();
    }
    this.downLoading = false;
  }

  renderChart(res: InverterResHistorian[]) {
    this.chartData = res;
    const series: Series[] = [];
    res.forEach(r => {
      const data: [number, number][] = [];
      r.records.forEach(r1 => {
        const val = parseFloat(r1.Value);
        const time = new Date(r1.TimeStamp).getTime();
        data.push([time, val]);
      });
      const strtmp: string  = r.Name
      const serie: Series = {
        name: strtmp + ' (' + r.Unit + ')',
        data: data
      };
      series.push(serie);
    });
    if (series.length > 0) {
      const id = UUID.UUID();
      const xaxis: XAxisParameters = new XAxisParameters();
      xaxis.labelType = XAxisType.datetime;
      const _config = new ChartParameters(this.uuid);
      _config.addSeries(series);
      _config.addXAxis(xaxis);
      const _legend: LegendParameter = new LegendParameter();

      _legend.VerticalAlign = VAlingn.top;
      _legend.layout = LegendLayout.vertical;
      _legend.HorizontalAlign = HAlign.right;
      _config.setLegend(_legend);
      _config.setTitle(null);
      this.chartParameters = _config;
    }
  }


  getReqDataConfig( tags: string[], startTime: string, endTime: string) {
    //const tags: TagsStateModel[] = this.store.selectSnapshot(TagsState);
    //const tagsSelected = tags.filter(x => this.tagNames.indexOf(x.Name) !== -1);
    //const reqType = ValueType.Plot;
    //const itemIds = tagsSelected.map(x => x.Id);
    let req: InverterReqHistorian[] = [];
    tags.forEach(item => {
      let reqItem: InverterReqHistorian = {
        Name: item,
        Options: {
          Time: "",
          StartTime: startTime,
          EndTime: endTime
        }
      }
      req.push(reqItem);
    })
    //console.log(req)
    return req;
  }

  validateParameters() {
    const diff = this.endTime.getTime() - this.startTime.getTime();
    if (this.tagNames.length === 0) {
      alert('please select tags.');
      throw new Error('Tags not selecting.');
    }
    else if (!this.startTime) {
      alert('please select start-time.');
      throw new Error('Start-time not selecting.');
    }
    else if (!this.endTime) {
      alert('please select end-time.');
      throw new Error('End-time not selecting.');
    }
    else if (diff <= 0) {
      alert('Start time should be less than end time.');
      throw new Error('Start time should be less than end time.');
    }
  }

  getMaxValueRecord(data:any[]) {
    if(data){
      return data.map(item => {
        const maxValues = {};
        item.records.forEach(record => {
          const TimeStamp = record.TimeStamp;
          const value = parseFloat(record.Value);
  
          if (!maxValues[TimeStamp] || value > parseFloat(maxValues[TimeStamp].Value)) {
            maxValues[TimeStamp] = {...record,Value:value.toString() };
          }
        });
  
  
        const maxRecords = Object.values(maxValues)
        return  {...item, records:maxRecords}
      });
    } else {
      return [];
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
    const startTime = this.getLastTime();
      const endTime = this.dateTimeService.getDateTime(new Date());
      this.reqCurrs = this.getReqDataConfig(this.tagNames, startTime, endTime);
      const res: InverterResHistorian[] = await this.httpService.getHistorian(this.reqCurrs);
      if (res.length > 0) {
        this.updateChart(res);
      }
  }

  updateChart(res: InverterResHistorian[]) {
    res.forEach(item => {
      const data = this.getPoints(item.records);
      this.chartParameters.changeSerie(item.Name, data);
    });
  }


  getLastTime(): string {
    const timeList: number[] = [];
    this.chartParameters.series.forEach(s => {
      if (s.data.length > 0) {
        const lastData = s.data[s.data.length - 1];
        const maxTime = lastData[0];
        timeList.push(maxTime);
      }
    });
    const min = Math.min(...timeList);
    const dateTime = new Date(min);
    return (dateTime) ? this.dateTimeService.getDateTime(dateTime) : this.dateTimeService.getDateTime(this.startTime);
  }

  exportToExcel(): void {
    const headers = ['TimeStamp'];
    const rows:any[] = [];

    if(this.chartData.length > 0){
      this.chartData.forEach(record => {
        headers.push(record.Name);
      });
  
      this.chartData[0].records.forEach((item, index)=> {
        const row = [item.TimeStamp];
        this.chartData.forEach( x => {
          if(x.records && x.records[index] && x.records[index].Value){
            row.push(x.records[index].Value);
          }
        });
        rows.push(row);
      })

      const sheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      const workbook: XLSX.WorkBook = { Sheets: { 'data': sheet }, SheetNames: ['data'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'export data');
    }
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = window.URL.createObjectURL(data);
    link.download = fileName + '.xlsx';
    link.click();
  }

  captureScreen() {
    const chart = document.getElementById('htmlData') as HTMLElement;
    if(chart){
      html2canvas(chart).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, 'screenshot.png');
        });
      });

    }
  }

  private getPoints(item: Record[]): [number, number][] {
    const data: [number, number][] = [];
    item.forEach(d => {
      data.push([new Date(d.TimeStamp).getTime(), +d.Value]);
    });
    return data;
  }

  getStartView(type: string) {
    if (type === 'daily') {
      return null;
    }
    else if(type === 'weekly') {
      return undefined;
    }
    else if(type === 'monthly') {
      return 'year';
    }
    else if(type === 'yearly') {
      return 'multi-years';
    }
  } 

  onDateTimeChange(event:Date) {
    this.dateTime = new Date(event.setHours(0,0,0,0));
    switch(this.periodGroupSelected.Type){
      case "daily":
        this.startDate = this.dateTimeService.getDateTime(this.dateTime);
        const endD = this.dateTime.setHours(23,59,59,0);
        this.endDate = this.dateTimeService.getDateTime(new Date(endD));
        break;
      case "weekly":
        const date = event.setHours(0,0,0,0);
        if(new Date(date).getDay() != 0){
          const startDay = new Date(date).getDate() - new Date(date).getDay();
          this.startDate = this.dateTimeService.getDateTime(new Date(new Date(date).setDate(startDay+1)));
          const end = this.dateTime.setHours(23,59,0,0);
          const lastDay = new Date(end).setDate(startDay+7);
          this.endDate = this.dateTimeService.getDateTime(new Date(lastDay));
        } else {
          const startDay = new Date(date).getDate() - 7;
          this.startDate = this.dateTimeService.getDateTime(new Date(new Date(date).setDate(startDay+1)));
          const end = this.dateTime.setHours(23,59,0,0);
          const lastDay = new Date(end).setDate(startDay+7);
          this.endDate = this.dateTimeService.getDateTime(new Date(lastDay));
        }
        break;
      case "monthly":
        let startDate = this.dateTime.setDate(1);
        this.startDate = this.dateTimeService.getDateTime(new Date(startDate));
        let endDate = new Date(this.dateTime);
        endDate.setMonth(endDate.getMonth() + 1, 1);
        this.endDate = this.dateTimeService.getDateTime(endDate);
        //this.dateTime = new Date();
        break;
      case "yearly":
        let startMonth = this.dateTime.setMonth(1, 1);
        this.startDate = this.dateTimeService.getDateTime(new Date(startMonth));
        let endMonth = new Date(this.dateTime);
        endMonth.setFullYear(endMonth.getFullYear(), 12, 1);
        this.endDate = this.dateTimeService.getDateTime(endMonth);
        //this.dateTime = new Date();
        break;
    }
    //console.log('start : ' + this.startDate + '\nend : '+ this.endDate);
    // if(this.isInitialize){
    //   this.selectChart();
    // }
  }

}
