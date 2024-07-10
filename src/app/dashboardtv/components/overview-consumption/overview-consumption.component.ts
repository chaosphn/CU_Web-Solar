import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-overview-consumption',
  templateUrl: './overview-consumption.component.html',
  styleUrls: ['./overview-consumption.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewConsumptionComponent implements OnInit, OnChanges {

  @Input() power?: string;
  @Input() today?: string;
  @Input() total?: string;
  @Input() month?: string;
  @Input() year?: string;
  @Input() pr?: string;
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    //this.setProgressValue();
  }

  ngOnInit() {
  }

}
