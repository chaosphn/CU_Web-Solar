import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Period } from '../../models/period';

@Component({
  selector: 'app-period',
  templateUrl: './period.component.html',
  styleUrls: ['./period.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeriodComponent implements OnInit, AfterViewChecked {

  @Input() periodSelected: Period;
  @Input() periods: Period[] = [];
  @Output() select = new EventEmitter();

  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngAfterViewChecked() {
      this.cdRef.detectChanges();
  }

  selectPeriod(period: Period) {
    setTimeout(() => {
      this.periodSelected = period;
      this.select.emit(this.periodSelected);
    }, 0);

  }

}
