import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngxs/store';
import { LocationStateModel } from 'src/app/core/stores/location/location.model';
import { AddZone } from 'src/app/core/stores/location/location.state';

@Component({
  selector: 'app-overall-infomation',
  templateUrl: './overall-infomation.component.html',
  styleUrls: ['./overall-infomation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverallInfomationComponent implements OnInit, OnDestroy, OnChanges {

  @Input() config: LocationStateModel[] = [];
  @Input() zoneDisplayed: string = 'all';
  constructor( private store: Store ) { }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log(this.zoneDisplayed)
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    
  }

  async updateLocation(name: string){
    const zone = this.config.find(x => x.zone == name);
    //console.log(name)
    //console.log(zone)
    if(zone){
      await this.store.dispatch(new AddZone(zone)).toPromise();
    }
  }

  onChangeZone(s: string){
    return s.toLowerCase() == this.zoneDisplayed.toLowerCase() ? true : false;
  }

}
