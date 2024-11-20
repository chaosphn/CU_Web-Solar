import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SingleValue1 } from 'src/app/share/models/value-models/group-data.model';
import { LocationStateModel } from 'src/app/core/stores/location/location.model';


@Component({
  selector: 'app-southwest-infomation',
  templateUrl: './southwest-infomation.component.html',
  styleUrls: ['./southwest-infomation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SouthwestInfomationComponent implements OnInit, OnChanges {

  @Input() data: SingleValue1 = {};
  @Input() location: LocationStateModel;
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    
  }

}