import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { LocationStateModel } from 'src/app/core/stores/location/location.model';
import { SingleValue1 } from 'src/app/share/models/value-models/group-data.model';

@Component({
  selector: 'app-northeast-infomation',
  templateUrl: './northeast-infomation.component.html',
  styleUrls: ['./northeast-infomation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NortheastInfomationComponent implements OnInit, OnChanges {

  @Input() data: SingleValue1 = {};
  @Input() location: LocationStateModel;
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    
  }

}
