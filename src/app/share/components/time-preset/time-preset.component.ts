import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-time-preset',
  templateUrl: './time-preset.component.html',
  styleUrls: ['./time-preset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimePresetComponent implements OnInit {

  constructor() { }

  @Input() periodNames: string[] = [];
  @Output() select = new EventEmitter();
  @Input() periodSelected: string;

  ngOnInit() {

    
  }


  selectPeriod(periodName: string) {
    // this.periodSelected = periodName;
    this.select.emit(periodName);
  }


  getActive(p: string): boolean{
    if (!p || !this.periodSelected) {
      return false;
    }
    return (p.toLowerCase() === this.periodSelected.toLowerCase()) ? true : false;
  }

}
