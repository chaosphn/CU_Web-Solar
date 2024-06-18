import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppLoadService } from './../../share/services/app-load.service';

@Injectable({providedIn: 'root'})
export class ReportHttpService {
    constructor(private httpClient: HttpClient,
        private appLoadService: AppLoadService) { }
    
    async getReport(name: string, type: string) {
        const body = {
            FileName: name,
            Type: type
        };
        const res: any = await this.httpClient.post(this.appLoadService.Config.UrlApi + 'getreport', body , {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
        responseType: 'blob'}).toPromise();
        return res;
    }


    getFile(name: string, date: string) {
        // public string Name { get; set; }
        // public string Mode { get; set; }
        // public DateTime Date { get; set; }
        const body = `?Name=${name}&Date=${date}&Mode=Download`;
        window.open(this.appLoadService.Config.UrlApi + 'api/Reports/GetFile2' + body, '_blank');
    }

    async getPdfFile(name: string, type: string) {
        try {
            const body = {
                FileName: name,
                Type: type
            };
            const res: any = await this.httpClient.post(this.appLoadService.Config.UrlApi + 'getreport', body, {
                headers: new HttpHeaders().set('Content-Type', 'application/json'),
                responseType: 'blob'
            }).toPromise();
            
            // Create a blob URL for the PDF content
            const blob = new Blob([res], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            
            // Create a temporary link element
            const a = document.createElement('a');
            a.href = url;
            a.download = name; // Specify the file name
            a.target = '_blank'; // Open in a new tab
            document.body.appendChild(a);
            
            // Trigger the download
            a.click();
            
            // Clean up
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            return res;
            
        } catch (error) {
            alert('File not found.');
            //console.error('Error downloading report:', error);
            // Handle errors, if any
        }
    }

    async getXlsxFile(name: string, type: string) {
        try {
            const body = {
                FileName: name,
                Type: type
            };
    
            // Make sure the responseType is set to 'blob' for binary data
            const res: any = await this.httpClient.post(this.appLoadService.Config.UrlApi + 'getreport', body, {
                headers: new HttpHeaders().set('Content-Type', 'application/json'),
                responseType: 'blob'
            }).toPromise();
            
            // Create a blob URL for the Excel content
            const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            
            // Create a temporary link element
            const a = document.createElement('a');
            a.href = url;
            a.download = name; // Specify the file name with .xlsx extension
            a.target = '_blank'; // Open in a new tab
            document.body.appendChild(a);
            
            // Trigger the download
            a.click();
            
            // Clean up
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            return res;
            
        } catch (error) {
            alert('File not found.');
            //console.error('Error downloading report:', error);
            // Handle errors, if any
        }
    }
    

    // getFile1(params: ReportRequest) {
    //     const body = `?Name=${params.Name}&Type=${params.Type}&Folder=${params.Folder}&FilePrefix=${params.FilePrefix}&DateFormat=${params.DateFormat}&FileExtension=${params.FileExtension}&Date=${params.Date}`;
    //     window.open(this.appLoadService.Config.UrlApi + 'api/Reports/GetFile' + body, '_blank');
    // }
}
