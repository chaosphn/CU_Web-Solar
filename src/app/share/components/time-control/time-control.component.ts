import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { DateTimeAdapter, OwlDateTimeComponent, OwlDateTimeFormats, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';


const moment = (_moment as any).default ? (_moment as any).default : _moment;

export const MY_MOMENT_DATE_TIME_FORMATS: OwlDateTimeFormats = {
  // edit datePickerInput
  parseInput: 'YYYY-MM-DD',
  fullPickerInput: 'YYYY-MM-DD HH:mm',
  datePickerInput: 'YYYY-MM-DD', 
  timePickerInput: 'YYYY-MM-DD',
  monthYearLabel: 'YYYY-MM-DD',
  dateA11yLabel: 'YYYY-MM-DD',
  monthYearA11yLabel: 'YYYY-MM-DD',
};


@Component({
  selector: 'app-time-control',
  templateUrl: './time-control.component.html',
  styleUrls: ['./time-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE]},
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_DATE_TIME_FORMATS},
  ]
})
export class TimeControlComponent implements OnInit, OnChanges {
  date: any;
  dateTimeCustom: string;
  @Input() fontSize = '12px';
  @Input() dateTime: Date;
  @Input() title: string;
  @Input() pickerType = 'both';
  @Output() selectDatetime = new EventEmitter();
  @Input() startView: string;
  startViewEmptry: string;

  constructor(private dateTimeAdapter: DateTimeAdapter<any>) { }

  ngOnInit() {
    const newDate = new Date(this.dateTime);
    this.selectDatetime.emit(newDate);
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (propName === 'startView') {
        if (this.startView === 'year' || this.startView === 'multi-years') {
          this.setCustomDateTime();
          const newDate = new Date(this.dateTimeCustom);
          this.selectDatetime.emit(newDate);
        } else {
          const newDate = new Date(this.dateTime);
          this.selectDatetime.emit(newDate);
        }
      }
    }
    
  }

  afterPickerClosed() {
    console.log(this.date)
    this.setDate();
    this.setCustomDateTime();
  }

  setCustomDateTime() {
    if (this.startView === 'year') {
      this.dateTimeCustom = this.dateTimeAdapter.format(this.dateTime, 'YYYY-MM');
    }
    else if(this.startView === 'multi-years') {
      this.dateTimeCustom = this.dateTimeAdapter.format(this.dateTime, 'YYYY');
    }
  }

  afterPickerClosed1() {
    this.setDate();
  }


  setDate() {
    const newDate = new Date(this.dateTime);
    this.selectDatetime.emit(newDate);
  }

  chosenMonthHandler(normalizedYear: Moment, datepicker: OwlDateTimeComponent<Moment>) {
    if (this.startView === 'year') {
      const date = new Date(normalizedYear.year(), normalizedYear.month(), normalizedYear.date());
      this.dateTime = date;
      this.setDate();
      datepicker.close();
    }
  }

  chosenYearHandler(normalizedYear: Moment, datepicker: OwlDateTimeComponent<Moment>) {
    if (this.startView === 'multi-years') {
      const date = new Date(normalizedYear.year(), normalizedYear.month(), normalizedYear.date());
      this.dateTime = date;
      this.setDate();
      datepicker.close();
    }
  }


}
