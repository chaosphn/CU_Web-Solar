import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SingleValue1 } from 'src/app/share/models/value-models/group-data.model';
import { LocationStateModel } from 'src/app/core/stores/location/location.model';


@Component({
  selector: 'app-northwest-infomation',
  templateUrl: './northwest-infomation.component.html',
  styleUrls: ['./northwest-infomation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NorthwestInfomationComponent implements OnInit, OnChanges {

  @Input() data: SingleValue1 = {};
  @Input() location: LocationStateModel;
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    
  }

}
