// export class ReportsComponent implements OnInit {
//   dateTime: Date;
//   reportConfig: ReportRequest[] = [];
//   pdf: string;
//   selectedReport: ReportRequest;
//   startView: string;
//   currentRoute: string;
//   siteName: string = ''; 
//   siteSelected: BuildingModel;
//   buildingList: BuildingModel[] = [];
//   sub1: Subscription;
//   startTime: Date;
//   endTime: Date;

//   constructor(private httpService: HttpService,
//     private reportHttpService: ReportHttpService,
//     private datePipe: DatePipe,
//     private dateTimeService: DateTimeService,
//     private router: Router,
//     private cd: ChangeDetectorRef,
//     private event: EventService,
//     private store: Store) {
//       this.sub1 = this.event.triggerFunction$.subscribe(() => {
//         this.updateInit();
//       });
//     }

//   async ngOnInit() {
//     this.dateTime = new Date(new Date().setDate(new Date().getDate()-1));
//     await this.getConfig();
//     this.initReportSelect();
//     this.initSiteSelect();
//     //console.log(this.selectedReport.Name);
//   }

//   updateInit(){
//     // const building: BuildingModel = JSON.parse(localStorage.getItem('location'));
//     // if(building && building.id){
//     //   this.siteSelected = building;
//     //   this.siteName = building.id;
//     // }
//     // this.cd.markForCheck();
//   }

//   ngOnDestroy() {
//     this.sub1.unsubscribe();
//   }

//   initReportSelect() {
//     if (this.reportConfig.length > 0) {
//       this.selectedReport = this.reportConfig[0];
//     }
//   }

//   initSiteSelect() {
//     if (this.buildingList.length > 0) {
//       this.siteSelected = this.buildingList[0];
//       this.siteName = this.buildingList[0].id;
//     }
//   }

//   async getConfig() {
//     const config: SiteStateModel = await this.httpService.getNavConfig('assets/main/BuildingList.json');
//     if(config){
//       config.building.sort((a,b) => parseInt(a.no) - parseInt(b.no));
//       this.buildingList = config.building;
//     }
//     this.reportConfig = await this.httpService.getConfig('assets/reports/report.config.json');
//   }

//   async selectReport() {
//     if (this.validateParameters()) {
//       // this.pdf = 'assets/reports/mock.pdf';
//       try {
//         let timestamp = this.datePipe.transform(this.dateTime, 'yyMMdd');
//         if(this.selectedReport.Type == "monthly"){
//           timestamp = this.datePipe.transform(this.dateTime, 'yyMM');
//         }
//         const reportName = this.siteName + this.selectedReport.Name + "_" + timestamp + ".pdf";
//         const blob = await this.reportHttpService.getReport(reportName, this.selectedReport.Type);
//         this.pdf = URL.createObjectURL(blob); 
//       } catch (error) {
//         alert('File not found.');
//       }
//     }
//   }

//   validateParameters(): boolean {
//     if (!this.dateTime) {
//       alert('Please select date');
//       return false;
//     }
//     if (!this.selectedReport) {
//       alert('Please select report');
//       return false;
//     }
//     if (!this.siteName) {
//       alert('Please select building');
//       return false;
//     }
//     return true;
//   }

//   download1() {
//     const a = document.createElement('a');
//     a.href = this.pdf;
//     const filename = this.getFileName();

//     a.download = filename;
//     document.body.appendChild(a);
//     a.click();
//     setTimeout(function(){
//       document.body.removeChild(a);
//       window.URL.revokeObjectURL(this.pdf);  
//   }, 100);  
//   }
  
//   async downloadPdf() {
//     if (this.validateParameters()) {
//       // this.pdf = 'assets/reports/mock.pdf';
//       try {
//         let timestamp = this.datePipe.transform(this.dateTime, 'yyMMdd');
//         if(this.selectedReport.Type == "monthly"){
//           timestamp = this.datePipe.transform(this.dateTime, 'yyMM');
//         }
//         const reportName = this.siteName + this.selectedReport.Name + "_" + timestamp + ".pdf";
//         const report = await this.reportHttpService.getPdfFile(reportName, this.selectedReport.Type);
//       } catch (error) {
//         alert('File not found.');
//       }
//     }
//   }

//   async downloadXls() {
//     if (this.validateParameters()) {
//       // this.pdf = 'assets/reports/mock.pdf';
//       try {
//         let timestamp = this.datePipe.transform(this.dateTime, 'yyMMdd');
//         if(this.selectedReport.Type == "monthly"){
//           timestamp = this.datePipe.transform(this.dateTime, 'yyMM');
//         }
//         const reportName = this.siteName + this.selectedReport.Name + "_" + timestamp + ".xlsx";
//         const report = await this.reportHttpService.getXlsxFile(reportName, this.selectedReport.Type);
//       } catch (error) {
//         alert('File not found.');
//       }
//     }
//   }

//   download() {
//     const timestamp = this.datePipe.transform(this.dateTime, 'yyyy-MM-dd');
//     this.reportHttpService.getFile(this.selectedReport.Name, timestamp);
//   }

//   getFileName(): string {
//     let filename = '';
//     const year = this.addZeroPrefix(this.dateTime.getFullYear(), 4);
//     const month = this.addZeroPrefix(this.dateTime.getMonth() + 1);
//     const date = this.addZeroPrefix(this.dateTime.getDate());
    
//     if (this.selectedReport.Type === 'Monthly') {
//       filename = this.selectedReport.Name + year + '_' + month + '.pdf';
//     }
//     else if (this.selectedReport.Type === 'Yearly') {
//       filename = this.selectedReport.Name + year + '.pdf';
//     }
//     else if (this.selectedReport.Type === 'Daily') {
//       filename = this.selectedReport.Name + year + '_' + month  + '_' + date  + '.pdf';
//     }
//     return filename;
//   }


//  addZeroPrefix(number: number, decimal = 2): string {
//    return ('0' + number).slice(-(decimal));
//   }

//   onDateTimeChange(event) {
//     this.dateTime = event;
//   }

//   getStartView(type: string) {
//     if (type === 'daily') {
//       return null;
//     }
//     else if(type === 'monthly') {
//       return 'year';
//     }
//     else if(type === 'yearly') {
//       return 'multi-years';
//     }
//   } 

//   selectSite(data:BuildingModel){
//     this.siteSelected = data;
//     this.siteName = data.id;
//   }
// }