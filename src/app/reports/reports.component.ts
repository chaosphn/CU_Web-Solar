import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReportRequest } from '../share/models/requests/report-request.model';
import { DateTimeService } from '../share/services/datetime.service';
import { HttpService } from './../share/services/http.service';
import { ReportHttpService } from './services/report-http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  dateTime: Date;
  reportConfig: ReportRequest[] = [];
  pdf: string;
  selectedReport: ReportRequest;
  startView: string;
  currentRoute: string;
  siteName: string = ''; 

  constructor(private httpService: HttpService,
    private reportHttpService: ReportHttpService,
    private datePipe: DatePipe,
    private dateTimeService: DateTimeService,
    private router: Router) {

    }

  async ngOnInit() {
    this.dateTime = new Date(new Date().setDate(new Date().getDate()-1));
    await this.getConfig();
    this.initReportSelect();
    //console.log(this.selectedReport.Name);
  }

  initReportSelect() {
    if (this.reportConfig.length > 0) {
      this.selectedReport = this.reportConfig[0];
    }
  }

  async getConfig() {
    this.reportConfig = await this.httpService.getConfig('assets/reports/report.config.solar2.json');
  }

  async selectReport() {
    if (this.validateParameters()) {
      // this.pdf = 'assets/reports/mock.pdf';
      try {
        const timestamp = this.datePipe.transform(this.dateTime, 'yyyy-MM-dd');
        const blob = await this.reportHttpService.getReport(this.selectedReport.Name, timestamp);
        this.pdf = URL.createObjectURL(blob); 
      } catch (error) {
        alert('File not found.');
      }
    }
  }

  validateParameters(): boolean {
    if (!this.dateTime) {
      alert('Please select date');
      return false;
    }
    if (!this.selectedReport) {
      alert('Please select report');
      return false;
    }
    return true;
  }

  download1() {
    const a = document.createElement('a');
    a.href = this.pdf;
    const filename = this.getFileName();

    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){
      document.body.removeChild(a);
      window.URL.revokeObjectURL(this.pdf);  
  }, 100);  
  }
  
  downloadPdf() {
    const timestamp = this.datePipe.transform(this.dateTime, 'yyyy-MM-dd');
    this.reportHttpService.getPdfFile(this.selectedReport.Name, timestamp);
  }

  download() {
    const timestamp = this.datePipe.transform(this.dateTime, 'yyyy-MM-dd');
    this.reportHttpService.getFile(this.selectedReport.Name, timestamp);
  }

  getFileName(): string {
    let filename = '';
    const year = this.addZeroPrefix(this.dateTime.getFullYear(), 4);
    const month = this.addZeroPrefix(this.dateTime.getMonth() + 1);
    const date = this.addZeroPrefix(this.dateTime.getDate());
    
    if (this.selectedReport.Type === 'Monthly') {
      filename = this.selectedReport.Name + year + '_' + month + '.pdf';
    }
    else if (this.selectedReport.Type === 'Yearly') {
      filename = this.selectedReport.Name + year + '.pdf';
    }
    else if (this.selectedReport.Type === 'Daily') {
      filename = this.selectedReport.Name + year + '_' + month  + '_' + date  + '.pdf';
    }
    return filename;
  }


 addZeroPrefix(number: number, decimal = 2): string {
   return ('0' + number).slice(-(decimal));
  }

  onDateTimeChange(event) {
    this.dateTime = event;
  }

  getStartView(type: string) {
    if (type === 'Daily') {
      return null;
    }
    else if(type === 'Monthly') {
      return 'year';
    }
    else if(type === 'Yearly') {
      return 'multi-years';
    }
  } 
}
