import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigModel } from '../models/value-models/config.model';
 
 
@Injectable()
export class AppLoadService {
    Config: ConfigModel = { 
        UrlApi: null,
        UrlApiAuthen: null,
        Timer: 60,
    };

    defaultRoute = '/main/mapview';

  constructor(private httpClient: HttpClient) { }
 
  async getSettings(): Promise<any> {
    const settings: any = await this.httpClient.get('assets/config.json').toPromise();    
    this.Config.UrlApi = settings.UrlApi;
    this.Config.UrlApiAuthen = settings.UrlApiAuthen;
    this.Config.Timer = settings.Timer;
    return this.Config;
  }
}
