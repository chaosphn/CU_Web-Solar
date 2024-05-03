import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppLoadService } from './../../share/services/app-load.service';

@Injectable({providedIn: 'root'})
export class ReportHttpService {
    constructor(private httpClient: HttpClient,
        private appLoadService: AppLoadService) { }
    
    async getReport(name: string, date: string) {
        const body = `?Name=${name}&Date=${date}&Mode=View`;
          const res: any = await this.httpClient.get(this.appLoadService.Config.UrlApi + 'api/Reports/GetFile2' + body , {
            headers: new HttpHeaders().set('Content-Type', 'application/json'),
            responseType: 'blob'
          }).toPromise();
          return res;
    }


    getFile(name: string, date: string) {
        // public string Name { get; set; }
        // public string Mode { get; set; }
        // public DateTime Date { get; set; }
        const body = `?Name=${name}&Date=${date}&Mode=Download`;
        window.open(this.appLoadService.Config.UrlApi + 'api/Reports/GetFile2' + body, '_blank');
    }

    getPdfFile(name: string, date: string) {
        // public string Name { get; set; }
        // public string Mode { get; set; }
        // public DateTime Date { get; set; }
        const body = `?Name=${name}&Date=${date}&Mode=View`;
        console.log(body);
        window.open(this.appLoadService.Config.UrlApi + 'api/Reports/GetFile2' + body, '_blank');
    }

    // getFile1(params: ReportRequest) {
    //     const body = `?Name=${params.Name}&Type=${params.Type}&Folder=${params.Folder}&FilePrefix=${params.FilePrefix}&DateFormat=${params.DateFormat}&FileExtension=${params.FileExtension}&Date=${params.Date}`;
    //     window.open(this.appLoadService.Config.UrlApi + 'api/Reports/GetFile' + body, '_blank');
    // }
}
