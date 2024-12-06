import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SingleValue1 } from 'src/app/share/models/value-models/group-data.model';
import { LocationStateModel } from 'src/app/core/stores/location/location.model';
import { Router } from '@angular/router';
import { BuildingModel } from 'src/app/core/stores/sites/sites.model';
import { EventService } from 'src/app/share/services/event.service';


@Component({
  selector: 'app-northwest-infomation',
  templateUrl: './northwest-infomation.component.html',
  styleUrls: ['./northwest-infomation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NorthwestInfomationComponent implements OnInit, OnChanges {

  @Input() data: SingleValue1 = {};
  @Input() location: LocationStateModel;
  @Input() building: BuildingModel[] = [];
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
  }

  ngOnChanges(changes: SimpleChanges): void {
    
  }

}
