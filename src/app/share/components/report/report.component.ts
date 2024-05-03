import { DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Store } from '@ngxs/store';
import { Subscription, timer } from 'rxjs';
import { ServersStateModel } from 'src/app/core/stores/servers/servers.model';
import { ServersState } from 'src/app/core/stores/servers/servers.state';
import { DataRecords } from '../../../core/stores/last-values/dashboard/dashboard-last-values.model';
import { TagsStateModel } from '../../../core/stores/tags/tags.model';
import { AddTags, TagsState } from '../../../core/stores/tags/tags.state';
import { DataRead } from '../../models/data-read.model';
import { ReportData } from '../../models/report.model';
import { ResponseData } from '../../models/response-data.model';
import { AppLoadService } from '../../services/app-load.service';
import { HttpService } from '../../services/http.service';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnChanges, OnDestroy {

  @Input() reportConfig: any[] = [];
  @Input() reportsData1: ReportData[][] = [];
  @Input() headers: string[];
  subscriptions: Subscription[] = [];
  reportsData: ReportData[][] = [];
  reqData: DataRead;
  
  constructor(
  // private tagService: DashboardTagService,
  private reportService: ReportService,
  private store: Store,
  private appLoadService: AppLoadService,
  private decimalPipe: DecimalPipe,
  private httpService: HttpService,
  private cd: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngOnChanges(change: SimpleChanges) {
    // if (this.reportConfig.length > 0 && this.headers.length > 0) {
    //   this.init();
    // }
    if (this.reportConfig.length > 0) {
      this.init();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  async init() {
    this.reportsData = this.reportsData1;
    this.getHeader();
    //console.log(this.reportsData.length +1)
    // this.addServerName();
    // await this.registerTag();
    // const res = await this.requestData();
    // this.transformData(res);
    // this.startTimer(this.appLoadService.Config.Timer * 1000);
  }

  getHeader() {
    const headers = Object.keys(this.reportConfig[0]);
    this.headers = headers;
    
  }

  addServerName() {
    // const reportConfig = this.reportConfig.filter(x => x)
    this.reportConfig = this.reportService.addServerName(this.reportConfig);
  }

  async registerTag() {
    const tagNames = this.reportService.getTagNames(this.reportConfig);
    await this.store.dispatch(new AddTags(tagNames)).toPromise();
  }

  async requestData(): Promise<ResponseData[]> {
    const tagNames = this.reportService.getTagNames(this.reportConfig);
    const tags: TagsStateModel[] = this.store.selectSnapshot(TagsState.getTagIds(tagNames));
    const tagIds = tags.map(t => t.Id);
    this.reqData = this.reportService.getRequetReportCurrents(tagIds);
    const res: ResponseData[] = await this.httpService.getData([this.reqData]);
    return res;
  }


  transformData(res: ResponseData[]) {
    const server: ServersStateModel = this.store.selectSnapshot(ServersState);
    const serverName = server.serverSelected;
    this.reportsData = [];
    this.reportConfig.forEach(config => {
      const report: ReportData[] = [];
      this.headers.forEach(headerName => {
        const tagName = config[headerName];
        const currRes = res[0].DataSets.find(x1 => x1.ItemName === tagName);
        let dataRecord: DataRecords = null;
        if (currRes) {
          dataRecord = currRes.Records[0];
        }
        report.push({
          name: headerName,
          tagName: tagName,
          value: (headerName === 'Name') ? config.Name.replace(serverName, '') : (dataRecord) ? dataRecord.Value : '---',
          quality: (dataRecord) ? dataRecord.Quality : 'Good',
          timestamp: (dataRecord) ? dataRecord.Timestamp : '---'
        });
      });
      this.reportsData.push(report);      
    });
    this.cd.markForCheck();
  }

  startTimer(dueTimer: number) {
    // const _timer = timer(dueTimer, 3000).pipe(take(1)).subscribe(x => {
      const _timer = timer(5000, dueTimer).subscribe(x => {
      this.timerTick();
    });
    this.subscriptions.push(_timer);
  }

  async timerTick() {
    const res: ResponseData[] = await this.httpService.getData([this.reqData]);
    this.transformData(res);
  }

  getValue(value: any) {
    this.cd.markForCheck();
    if (typeof value === 'number') {
      const num = this.decimalPipe.transform(value, '1.0-1');
      return num;
    }
    else if (value) {
      //console.log(value)
      return value.toString();
    }
    else {
      return '---';
    }
  }

}
