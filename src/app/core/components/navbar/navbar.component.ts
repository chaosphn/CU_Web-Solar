import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserStateModel } from '../../stores/user/user.model';
import { UserState } from '../../stores/user/user.state';
import { AuthService } from './../../../share/services/auth.service';
import { HttpService } from '../../../share/services/http.service';
import { DashboardRequestStateModel } from '../../../core/stores/requests/dashboard/dashboard-request.model';
import { Subscription, timer } from 'rxjs';
import { fastPropGetter } from '@ngxs/store/src/internal/internals';
import { FormControl, Validators } from '@angular/forms';
import { BuildingModel, SiteStateModel } from '../../stores/sites/sites.model';
import { AddSite } from '../../stores/sites/sites.state';
import { d } from '@angular/core/src/render3';
import { Router,NavigationEnd  } from '@angular/router';
import { PowermetersComponent } from 'src/app/powermeters/powermeters.component';
import { EventService } from 'src/app/share/services/event.service';
import { SetBulding } from '../../stores/building/building.state';
import { DateTimeService } from 'src/app/share/services/datetime.service';
import { MatSelect } from '@angular/material';

declare var $: any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})


export class NavbarComponent implements AfterViewInit, OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
  isChange: any;
  bgClass:string = "normal";
  bgStatus:boolean = false;
  role: string;
  pages: string[] = [];
  status1: string = '0';
  status2: string = '0';
  status3: string = '0';
  siteControl = new FormControl('',[Validators.required])
  siteList: string[] = [];
  timerSubscription: Subscription;
  sub1: Subscription;
  currentRoute: string;
  diagramSelecter:any = false;
  diagramRouter:any = '/main/diagram';
  siteSelected: BuildingModel = {
    no:"01",
    id:"ARC003",
    zone:"3",
    name:"อาคารเลิศ อุรัสยะนันทน์",
    capacity: 113.4
  };
  nowUrl: string;
  buildingList: SiteStateModel;
  today: string;
  filteredBuildingList: any[] = [];
  selectedZone: string = ''
  meterSelected: string;

  @ViewChild('searchInput') searchInput: any;
  @ViewChild('selectDropdown') selectDropdown: MatSelect;

  constructor(private breakpointObserver: BreakpointObserver, 
    private route: ActivatedRoute,private httpService: HttpService,
    private authService: AuthService, 
    private store: Store,
    private router: Router,
    private event: EventService,
    private dateTimeSrv: DateTimeService) {
    this.isHandset$.subscribe(s => {
      if (!s) {
        this.initCarousel();
      }
    });
    this.currentRoute = router.url;
    this.sub1 = this.event.triggerFunction$.subscribe(() => {
      const site = localStorage.getItem('location');
      this.siteSelected = JSON.parse(site);
    });  
    this.isChange = event.triggerNavbar$.subscribe(()=>{
      this.toggleBackground("/main/dashboard1");
    });
  }

  ngOnInit() {
    const userState: UserStateModel = this.store.selectSnapshot(UserState);
    this.pages = userState.PageNames;
    this.pages = this.pages.map(x => x.toLowerCase().split(' ').join(''));
    this.role = userState.Username;
    this.getConfig();
    const site = localStorage.getItem('location');
    if(site){
      this.siteSelected = JSON.parse(site);
    }
    //console.log(this.siteSelected)
    this.currentRoute = this.router.url.toString()
    //this.readStatus();
    //this.startTimer(2000);
    this.today = this.dateTimeSrv.getDateTime(new Date()).substring(0,10);
    this.toggleBackground(this.currentRoute);
    if(this.buildingList){
      this.filteredBuildingList = this.buildingList.building;
      this.tagShowList = this.buildingList.building.map((_, index) => index);
    }
  }

  async getConfig() {
    //this.siteList = await this.httpService.getConfig('assets/main/location.json');
    const config: SiteStateModel = await this.httpService.getNavConfig('assets/main/BuildingList.json');
    if(config){
      config.building.sort((a,b) => a.zone.localeCompare(b.zone));
      this.buildingList = config;
      this.store.dispatch(new AddSite(this.buildingList));
    }
    // console.log(this.buildingList)
  }

  toggleBackground(data:string){
    if( data == '/main/dashboardtv' ){
      this.bgStatus = true;
      //console.log('special bg1');
    } else{
      this.bgStatus = false;
      //console.log('normal bg1');
    }
  }

  selectMeter(id: string[]){
    this.buildingList.building.map(function(item){
      if(id.includes(item.id) && !item.building){
        item.display = true;
      } else if(!item.building){
        item.display = false;
      }
      return item;
    })
  }

  checkRoute(){
    const rout = this.router.url.toString();
    if( rout == '/main/dashboardtv' ){
      return false;
    } else{
      return true;
    }
  }

  logout() {
    this.authService.logout();
  }

  ngAfterViewInit() {
    this.initCarousel();
  }

  initCarousel() {
    $('.owl-carousel').owlCarousel({
      stagePadding: 10,
      items: 6,
      autoWidth: true,
      margin: 25,
      dots: false
    });
  }


  startTimer(dueTimer: number) {
    // const _timer = timer(dueTimer, 3000).pipe(take(1)).subscribe(x => {
    this.unsubscribe();
    const _timer = timer(5000, dueTimer).subscribe(x => {
      
    });
    this.timerSubscription = _timer;
  }

  unsubscribe() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.sub1.unsubscribe();
  }

  async selectSite(data:BuildingModel){
    this.siteSelected = data;
    localStorage.setItem('location', JSON.stringify(data));
    this.event.triggerFunction()
    await this.store.dispatch( new SetBulding(data)).toPromise();
  }

  updateData(){
    this.event.triggerFunction()
  }

  callHome(){
    this.event.changeNavbar();
    this.router.navigate(['/main/dashboard1']);
  }

  tagShowList = [0,4,5,6,7,8]
  
  onZoneChange(event){
    this.tagShowList = []
    const selectedZone = event;
    this.filteredBuildingList = this.buildingList.building.filter((item,index) => {
     if(item.zone === selectedZone){
       this.tagShowList.push(index);
     } 
    }) ;
  }

  filter(query: string) {
    if(query){
      this.filteredBuildingList = this.buildingList.building.filter((building, index) => {
        const matches = building.name.toLowerCase().includes(query.toLowerCase());
        if (matches) {
          this.tagShowList.push(index);
          building.display = true;
        } else {
          building.display = false;
        }
        return building;
      });
    } else {
      this.filteredBuildingList = this.buildingList.building.map(function(item){
        if(item.building){
          item.display = true;
        } else {
          item.display = false;
        }
        return item;
      })
    }

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