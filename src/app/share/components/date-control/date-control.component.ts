import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PeriodGroup } from '../../models/period-time';
@Component({
  selector: 'app-date-control',
  templateUrl: './date-control.component.html',
  styleUrls: ['./date-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateControlComponent implements OnInit {

  constructor() { }

  @Input() periodNames: PeriodGroup[] = [];
  @Output() select = new EventEmitter();
  @Input() periodSelected: PeriodGroup;

  ngOnInit() {

    
  }


  selectPeriod(periodName: PeriodGroup) {
    // this.periodSelected = periodName;
    this.select.emit(periodName);
  }


  getActive(p: string): boolean{
    if (!p || !this.periodSelected) {
      return false;
    }
    return (p.toLowerCase() === this.periodSelected.Name.toLowerCase()) ? true : false;
  }
}
