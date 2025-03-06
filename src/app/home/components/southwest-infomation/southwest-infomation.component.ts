import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { SingleValue1 } from 'src/app/share/models/value-models/group-data.model';
import { LocationStateModel } from 'src/app/core/stores/location/location.model';
import { Router } from '@angular/router';
import { BuildingModel } from 'src/app/core/stores/sites/sites.model';
import { EventService } from 'src/app/share/services/event.service';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-southwest-infomation',
  templateUrl: './southwest-infomation.component.html',
  styleUrls: ['./southwest-infomation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SouthwestInfomationComponent implements OnInit, OnChanges, OnDestroy {

  @Input() data: SingleValue1 = {};
  @Input() location: LocationStateModel;
  @Input() building: BuildingModel[] = [];
  subSrciber: Subscription;
  constructor(private router: Router, private event: EventService) { }
  navigateToBuilding(id : string){
    const mt = this.building.find(x => x.id == id);
    if(mt){
      localStorage.setItem('location', JSON.stringify(mt));
      this.event.changeNavbar();
      this.router.navigate(['/main/building']);
    }
  }

  ngOnInit() {
    this.startTimers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log(this.data)
  }

  ngOnDestroy(): void {
    this.subSrciber.unsubscribe();
  }

  startTimers(){
    this.subSrciber = timer(1000, 10000).subscribe(x => {
      this.creatBuildingAnimate();
    })
  }

  creatBuildingAnimate(){
    //console.log('creatBuildingAnimate')
    this.resetBuildingAnimate();
    const path = document.getElementsByClassName('effect') as HTMLCollectionOf<HTMLElement>;
    const point = document.getElementsByClassName('point') as HTMLCollectionOf<HTMLElement>;
    setTimeout(() => {
      for (let i = 0; i < path.length; i++) {
        path[i].classList.add('stroke-effect');
      }
      for (let i = 0; i < point.length; i++) {
        point[i].classList.add('point-effect');
      }
      //console.log('end animate')
    }, 2000); 
  }

  resetBuildingAnimate(){
    //console.log('resetBuildingAnimate')
    const path = document.getElementsByClassName('effect') as HTMLCollectionOf<HTMLElement>;
    const point = document.getElementsByClassName('point') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < path.length; i++) {
      path[i].classList.remove('stroke-effect');
    }
    for (let i = 0; i < point.length; i++) {
      point[i].classList.remove('point-effect');
    }
    //console.log('end animate')
  }


}