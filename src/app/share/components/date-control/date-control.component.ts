import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { PeriodGroup } from '../../models/period-time';
@Component({
  selector: 'app-date-control',
  templateUrl: './date-control.component.html',
  styleUrls: ['./date-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateControlComponent implements OnInit, OnChanges {

  constructor() { }

  @Input() periodNames: PeriodGroup[] = [];
  @Output() select = new EventEmitter();
  @Input() periodSelected: PeriodGroup;
  @Input() disableButton: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    
  }

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
