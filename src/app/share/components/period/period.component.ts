import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Period } from '../../models/period';

@Component({
  selector: 'app-period',
  templateUrl: './period.component.html',
  styleUrls: ['./period.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeriodComponent implements OnInit, AfterViewChecked, OnChanges {

  @Input() periodSelected: Period;
  @Input() periods: Period[] = [];
  @Output() select = new EventEmitter();
  period: Period[] = [];
  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    
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
