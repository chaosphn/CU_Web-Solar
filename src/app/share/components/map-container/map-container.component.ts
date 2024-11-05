import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GroupData1 } from '../../models/value-models/group-data.model';
import { BuildingModel } from 'src/app/core/stores/sites/sites.model';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map-container',
  templateUrl: './map-container.component.html',
  styleUrls: ['./map-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapContainerComponent implements OnInit, OnChanges {

  @Input() data: GroupData1 = {
    singleValue: {},
    multipleValue: {}
  };
  @Input() building: BuildingModel[] = [];
  constructor(private router: Router, private event: EventService) { }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit() {
    
  }

  getSumValueByKeys(id: string, point: number){
    let res: string;
    const mt = this.building.find(x => x.id == id);
    if(mt && mt.building){
      let val: number = mt.building.reduce((acc, cur) => {
        let data = this.data.singleValue[cur+'_power'];
        if(data && data.dataRecords && data.dataRecords[0] && data.dataRecords[0].Value){ acc += parseFloat(data.dataRecords[0].Value); }
        return acc;
      }, 0);
      if(val > 0){
        res = val.toFixed(point);
      } else {
        res = "---";
      }
    }
    return res;
  }

  navigateToBuilding(id : string){
    const mt = this.building.find(x => x.id == id);
    if(mt){
      localStorage.setItem('location', JSON.stringify(mt));
      this.event.changeNavbar();
      this.router.navigate(['/main/building']);
    }
  }

}
