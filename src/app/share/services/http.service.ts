import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { flatMap, map, takeUntil } from 'rxjs/operators';
import { TagsStateModel } from '../../core/stores/tags/tags.model';
import { UserStateModel } from '../../core/stores/user/user.model';
import { EventModel } from '../../events/events.component';
import { ConfigModel } from '../models/value-models/config.model';
import { DashboardReqHistorian, DashboardReqRealtime, DashboardRequestStateModel} from './../../core/stores/requests/dashboard/dashboard-request.model';
import { AppLoadService } from './app-load.service';
import { WriteDataRequest } from 'src/app/core/stores/last-values/dashboard/dashboard-last-values.model';
import { DashboardConfigs } from 'src/app/core/stores/configs/dashboard/dashboard-configs.model';
import { TagInfo } from '../models/tag-group.model';
import { PowerTagConfig } from '../models/power-config.model';
import { HolidayRequestModel, ReportFactorModel, ReportRequestModel, SetHolidayModel } from '../models/report.model';
import { RequestOptions } from '@angular/http';

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    private cancelRequest = new Subject<void>();

    constructor(private httpClient: HttpClient,
        private appLoadService: AppLoadService,
        private router: Router) { 
    }

    async getRealtime(requests: DashboardReqRealtime) {
        const body = requests;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
 
        return this.httpClient.post( this.appLoadService.Config.UrlApi + 'getrealtime', body, {headers} ).pipe(
            map((x: any) => {
                
                return x;
            })
        ).toPromise();
    }

    // async getHistorian(requests: DashboardReqHistorian[]) {
    //     const body = requests;
    //     //console.log()
    //     const headers = new HttpHeaders({
    //         'Content-Type': 'application/json'
    //     });

    //     return this.httpClient.post( this.appLoadService.Config.UrlApi + 'gethisdata', body, {headers} ).pipe(
    //         map((x: any) => {
                
    //             return x;
    //         })
    //     ).toPromise();
    // }
    async getHistorian(requests: DashboardReqHistorian[]): Promise<any> {
        // Notify the previous request to cancel
        this.cancelRequest.next();
    
        const body = requests;
        const headers = new HttpHeaders({
          'Content-Type': 'application/json'
        });
    
        return this.httpClient.post(this.appLoadService.Config.UrlApi + 'gethisdata', body, { headers }).pipe(
          takeUntil(this.cancelRequest),  // Cancel the previous request
          map((x: any) => x)
        ).toPromise();
    }

    async getReportData(requests: DashboardReqHistorian[]) {
        const body = requests;
        //console.log()
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this.httpClient.post( this.appLoadService.Config.UrlApi + 'gethisdata', body, {headers} ).pipe(
            map((x: any) => {
                
                return x;
            })
        ).toPromise();
    }

    async getCompleteReportData(requests: ReportRequestModel) {
        const body = requests;
        //console.log()
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this.httpClient.post( /*this.appLoadService.Config.UrlApi*/'http://192.168.14.11:4040/' + 'api/genreport', body, {headers} ).pipe(
            map((x: any) => {
                
                return x;
            })
        ).toPromise();
    }

    async getPlotData(requests: DashboardReqHistorian[]) {
        const body = requests;
        //console.log()
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this.httpClient.post( this.appLoadService.Config.UrlApi + 'getplotdata', body, {headers} ).pipe(
            map((x: any) => {
                
                return x;
            })
        ).toPromise();
    }

    async getAggData(requests: DashboardReqHistorian[]) {
        const body = requests;
        //console.log()
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this.httpClient.post( this.appLoadService.Config.UrlApi + 'getaggdata', body, {headers} ).pipe(
            map((x: any) => {
                
                return x;
            })
        ).toPromise();
    }

    getConfig(path: string): Promise<any[]> {
        return this.httpClient.get<any[]>(path).toPromise();
    }

    getNavConfig(path: string): Promise<any> {
        return this.httpClient.get<any>(path).toPromise();
    }

    getConfig2(path: string): Promise<DashboardConfigs> {
        return this.httpClient.get<DashboardConfigs>(path).toPromise();
    }
    

    getConfigFile(path: string): Promise<any> {
        return this.httpClient.get<any>(path).toPromise();
    }

    getConfigJson(path: string): Promise<ConfigModel> {
        return this.httpClient.get<ConfigModel>(path).toPromise();
    }


    async getData(requests: DashboardRequestStateModel[]) {
        const body = {
            Requests: requests
        };
       
        return this.httpClient.post(this.appLoadService.Config.UrlApi + 'api/data/read', body).pipe(
            map((x: any) => {
                return x;
            })
        ).toPromise();
    }

    async writeData(requests: WriteDataRequest[]) {
        const body = requests;
       
        return this.httpClient.post(this.appLoadService.Config.UrlApi + 'api/data/write', body).pipe(
            map((x: any) => {
                return x;
            })
        ).toPromise();
    }

    async login1(username: string, password: string) {

        const body = `grant_type=password&username=${username}&password=${password}`;
        try {            
            const res: any = await this.httpClient.post(this.appLoadService.Config.UrlApiAuthen + '/api/token', body, {
                headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
            }).toPromise();
            if (res.access_token) {
                localStorage.setItem('token', res.access_token);
                localStorage.setItem('refresh_token', res.refresh_token);
                localStorage.setItem('username', username);
                return true;
            }
            else {
                return false;
            }
        }
        catch (err) {
            return false;
        }
    }

    async login(username: string, password: string) {
        const body = {
            user : username,
            password : password
        };
        //console.log(body)
        const res: any = await this.httpClient.post(this.appLoadService.Config.UrlApiAuthen + 'webauthen', body).toPromise();
        //console.log(res);
        return res;
    }

    async getUserGroup(username: string): Promise<UserStateModel> {
        const res: any = await this.httpClient.post<UserStateModel>(this.appLoadService.Config.UrlApiAuthen + 'api/users/GetGroups/' + username, null).toPromise();
        return res;
    }


    async getGroupConfig(group: string[]) {
        const res: any = await this.httpClient.post<UserStateModel>(this.appLoadService.Config.UrlApi + 'api/tag/getcategories/' , group).toPromise();
        return res;
    }

    getTagsGroupConfig(group: PowerTagConfig) {
        const body = {Group:group.Group};
        const res: any = this.httpClient.post(this.appLoadService.Config.UrlApi + 'gettaggroup' , body).toPromise();
        return res;
    }

    getTags(src: string) {
        const body = {
            cal:2,
            pointsource: src
        }
        const res: any = this.httpClient.post(this.appLoadService.Config.UrlApi + 'getags' , body).toPromise();
        return res;
    }

    async searchCategories(_param: string) {
        const res: any = await this.httpClient.post<UserStateModel>(this.appLoadService.Config.UrlApi + 'api/tag/searchcategories' , _param, {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        }).toPromise();
        return res;
    }


    async getAlarmEvent(req: any) {
        const res: any = await this.httpClient.post<EventModel[]>(this.appLoadService.Config.UrlApi + 'api/alarmevents/getevents/' , req).toPromise();
        return res;
    }
    
    async checkToken() {
        try{
            const res: any = await this.httpClient.post(this.appLoadService.Config.UrlApiAuthen + 'api/users/checkuser', null).toPromise();
            return res;
        }
        catch (ex) {
            return null;
        }
    }

    async getBreaker(url:string,username:string,n:string) {
        const body = {
            user:username,
            no: n
        }
        const res: any = await this.httpClient.post<EventModel[]>(this.appLoadService.Config.UrlApiAuthen+url,body).toPromise();
        // console.log(res)
        return res;
    }

    async setReportfactor(item: ReportFactorModel) {
        const body = item
        const res: any = await this.httpClient.post<ReportFactorModel>(this.appLoadService.Config.UrlApiAuthen + 'savefactors' ,body).toPromise();
        // console.log(res)
        return res;
    }

    async getReportfactor() {
        const res: any = await this.httpClient.get(this.appLoadService.Config.UrlApiAuthen + 'getfactors').toPromise();
        // console.log(res)
        return res;
    }

    async getReportHoliday(req: HolidayRequestModel) {
        const body = req;

        const res: any = await this.httpClient.post<HolidayRequestModel>(this.appLoadService.Config.UrlApiAuthen + 'getholidays', body).toPromise();
        // console.log(res)
        return res;
    }

    async setReportHoliday(item: any) {
        const body = item;
        const res: any = await this.httpClient.post(this.appLoadService.Config.UrlApiAuthen + 'setholidays' ,body).toPromise();
        // console.log(res)
        return res;
    }

    refreshToken(refreshToken: string): Observable<any> {
        const body = `grant_type=refresh_token&refresh_token=${refreshToken}`;
        const res = this.httpClient.post(this.appLoadService.Config.UrlApiAuthen + 'token', body, {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        });
        return res;
    }

    refreshLogin(username: string, password: string): Observable<any> {
        const body = {
            user : username,
            password : password
        };
        //console.log(body)
        const res: any = this.httpClient.post(this.appLoadService.Config.UrlApiAuthen + 'userauthen', body);
        //console.log(res);
        return res;
    }

    downloadFileAlarm(StartTime: string,EndTime: string,FilterObjectName: string,MaxEvents: string) {
        const body = `?StartTime=${StartTime}&EndTime=${EndTime}&FilterObjectName=${FilterObjectName}&MaxEvents=${MaxEvents}`;
        window.open(this.appLoadService.Config.UrlApi + 'api/alarmevents/GetEventsFile' + body, '_blank');
    }
}



