import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-envi-consumption',
  templateUrl: './envi-consumption.component.html',
  styleUrls: ['./envi-consumption.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnviConsumptionComponent implements OnInit, OnChanges {

  @Input() Irr: number;
  @Input() Amb: number;
  @Input() Pv: number;
  @Input() Inso: number;
  @Input() Co2: number;
  @Input() Saving: number;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    
  }

  ngOnInit() {
  }

}
