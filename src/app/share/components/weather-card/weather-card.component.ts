import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SiteStateModel } from 'src/app/core/stores/sites/sites.model';
import { Store } from '@ngxs/store';
import { AddSite } from 'src/app/core/stores/sites/sites.state';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-weather-card',
  templateUrl: './weather-card.component.html',
  styleUrls: ['./weather-card.component.scss']
})
export class WeatherCardComponent implements OnInit, OnChanges {

  
  @Input() temp = "38.8";
  @Input() hum = "55";
  @Input() windspd = "1.6";
  @Input() winddir = "45";
  @Input() irr = "956";
  @Output() selectSites = new EventEmitter();

  mode:boolean;
  toDay: string;
  dateTime: string;
  period: string = 'AM';
  currentRoute:string;
  bgClass:string = "normal";
  diagramSelecter:any = false; 
  site = [ 
    {value: 'ORG', viewvalue: 'OrangeMarket'},
    {value: 'THM', viewvalue: 'FruitMarket'},
    {value: 'PTN', viewvalue: 'ProtienMarket'},
    {value: 'FRH', viewvalue: 'FreshMarket'},
    {value: 'CNY', viewvalue: 'ContainerYard'}
  ];
  siteSelected: string = 'Orange Market';

  constructor(private datepipe: DatePipe,
      private store:Store,
      private router:Router,
      private event:EventService) { }

  ngOnInit() {
    this.toDay = this.datepipe.transform(new Date(), 'dd-MMMM-yyyy').replace("-"," ").replace("-"," ").toUpperCase();
    this.dateTime = this.formatTime();
    this.period = this.formatTime1();
    this.currentRoute = this.router.url.toString()
    this.siteSelected = localStorage.getItem('location');
    this.toggleSelector(this.currentRoute);
    this.toggleMode(this.currentRoute);
    this.toggleBackground(this.currentRoute);
  }

  ngOnChanges(changes: SimpleChanges): void {
    
  }

  formatTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let period = 'AM';
    if (hours >= 12) {
      period = 'PM';
      if (hours > 12) {
        hours -= 12;
      }
    }
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedTime = `${hours}:${formattedMinutes}`; 
    return formattedTime;
  }

  formatTime1() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let period = 'AM';
    if (hours >= 12) {
      period = 'PM';
      if (hours > 12) {
        hours -= 12;
      }
    }
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedTime = `${period}`;
    return formattedTime;
  }
  toggleBackground(route:string){
    if( route == '/main/tvdashboard' ){
      this.bgClass = "special";
      //console.log('special bg');
    } else{
      this.bgClass = "normal";
      //console.log('normal bg');
    }
  }

  toggleSelector(route:string){
    const url = route;
    if( url == '/main/diagram' || url == '/main/diagram1' 
      || url == '/main/diagram2' || url == '/main/diagram3' )
    {
      this.diagramSelecter = true;
      //console.log('normal selector');
    } else{
      this.diagramSelecter = false;
      //console.log('diagram selector');
    }
  }

  toggleMode(route:string){
    if( route == '/main/tvdashboard' || route == '/main/dashboard1'){
      this.mode = false;
      //console.log('normal weather bar');
    } else{
      this.mode = true;
      //console.log('site weather bar');
    }
  }

  async selectSite(data: string){
    // this.nowUrl = localStorage.getItem('nowUrl')
    this.siteSelected = data;
    localStorage.setItem('location', data);
    this.event.triggerFunction()
    //await this.store.dispatch( new AddSite({Name: data})).toPromise();
  }

  diagramNav(link:string){
    this.router.navigate([link])
    this.event.triggerFunction()
    const page = link.substring(6);
    switch(page){
      case'diagram':
        localStorage.setItem('location',this.site[0].viewvalue);
        break;
      case'diagram1':
        localStorage.setItem('location',this.site[1].viewvalue);
        break;
      case'diagram2':
        localStorage.setItem('location',this.site[2].viewvalue);
        break;
      case'diagram3':
        localStorage.setItem('location',this.site[3].viewvalue);
        break;
      case'diagram4':
        localStorage.setItem('location',this.site[4].viewvalue);
        break;
      default:
        break;
    }
    console.log(this.siteSelected);
  }

}

export interface Site{
  value: string,
  viewvalue: string
}

export interface Url {
  component:string,
  url:string
}