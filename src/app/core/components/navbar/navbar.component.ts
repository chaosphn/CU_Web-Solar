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
  siteSelected: string = "OrangeMarket";
  nowUrl: string;
  buildingList: SiteStateModel;
  today: string;
  filteredBuildingList: any[] = [];
  selectedZone: string = ''

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
      this.diagramRouting();
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
    this.siteSelected = localStorage.getItem('location');
    localStorage.setItem('location',this.siteSelected);
    //console.log(this.siteSelected)
    this.currentRoute = this.router.url.toString()
    //this.readStatus();
    //this.startTimer(2000);
    this.today = this.dateTimeSrv.getDateTime(new Date()).substring(0,10)
    this.getConfig();
    this.toggleBackground(this.currentRoute);
    this.filteredBuildingList = [...this.buildingList.building]
    this.tagShowList = this.buildingList.building.map((_, index) => index);
  }

  async getConfig() {
    //this.siteList = await this.httpService.getConfig('assets/main/location.json');
    this.buildingList = await this.httpService.getNavConfig('assets/main/BuildingList.json');
    this.store.dispatch(new AddSite(this.buildingList));
    // console.log(this.buildingList)
  }

  toggleBackground(data:string){
    this.currentRoute = data;
    const nav = document.querySelector(".sidenav") as HTMLElement;
    //console.log(this.currentRoute);
    if( data == '/main/dashboardtv' ){
      this.bgStatus = true;
      //console.log('special bg1');
    } else{
      this.bgStatus = false
      //console.log('normal bg1');
    }
    this.routing1(data);
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
    this.siteSelected = data.id;
    localStorage.setItem('location', JSON.stringify(data));
    this.event.triggerFunction()
    await this.store.dispatch( new SetBulding(data)).toPromise();
    this.diagramRouting();
  }

  async selectSiteMobile(data:string,links:string){
    this.nowUrl = this.router.url.toString()
    this.siteSelected = data;
    //console.log(this.nowUrl);
    //console.log(this.siteSelected);
    localStorage.setItem('location', JSON.stringify(data));
    this.event.triggerFunction()
    this.diagramRouting();
    // window.location.reload()
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
  this.tagShowList = []
    this.filteredBuildingList = this.buildingList.building.filter((building, index) => {
      const matches = building.name.toLowerCase().includes(query.toLowerCase());
      if (matches) {
        this.tagShowList.push(index);
      }
      return matches;
    });

    if (this.filteredBuildingList.length === 0) {
      // this.tagShowList = this.buildingList.building.map((_, index) => index); ////all build
      this.tagShowList = [0,4,5,6,7,8]
    }

    if (query.length == 0) {
      this.tagShowList = [0,4,5,6,7,8] //////ลบได้หลังข้อมูลตึกครบ
      query = '';
      this.searchInput.nativeElement.value = '';
      this.filter('')
    }
  }

  routing1(data:string){
    const url = localStorage.getItem('nowUrl');
    if(data.includes('diagram'))
    {
      this.diagramSelecter = true;
    } else{
      this.diagramSelecter = false;
    }
    if( data.includes('logout')){
      localStorage.setItem('location', data);
    }
  }

  diagramRouting(){
    this.siteSelected = localStorage.getItem('location');
    this.currentRoute = this.router.url.toString()
    //console.log(this.currentRoute)
    if(this.currentRoute.includes('diagram'))
    {
      this.diagramSelecter = true;
      //console.log(this.diagramRouter);
    } else{
      this.diagramSelecter = false;
    }
    switch(this.siteSelected){
        case 'OrangeMarket': {
          this.diagramRouter = ['/main/diagram'];
          //this.clickDiagram(this.diagramRouter);
          //this.routing1('diagram');
          break;
        }
        case 'FruitMarket': {
          this.diagramRouter = ['/main/diagram1'];
          //this.clickDiagram(this.diagramRouter);
          //this.routing1('diagram1');
          break;
        }
        case 'FreshMarket': {
          this.diagramRouter = ['/main/diagram2'];
          //this.clickDiagram(this.diagramRouter);
          //this.routing1('diagram2');
          break;
        }
        case 'ContainerYard': {
          this.diagramRouter = ['/main/diagram3'];
          //this.clickDiagram(this.diagramRouter);
          //this.routing1('diagram3');
          break;
        }
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