import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartOptions } from '../../models/chart-options.model';



@Component({
  selector: 'app-card-buiding',
  templateUrl: './card-buiding.component.html',
  styleUrls: ['./card-buiding.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardBuidingComponent implements OnInit, OnChanges {

  @Input() header: string
  @Input() topic1: string
  @Input() topic2: string
  @Input() topic3: string
  @Input() topic4: string
  @Input() value1: string
  @Input() value2: string
  @Input() value3: string
  @Input() value4: string
  @Input() unit1: string
  @Input() unit2: string
  @Input() unit3: string
  @Input() unit4: string
  @Input() img1: string
  @Input() img2: string
  @Input() img3: string
  @Input() img4: string
  @Input() power: string
  @Input() energy : string
  @Input() performance : string
  @Input() chartOptions: ChartOptions = {};
  chart: ChartOptions = {};
  constructor(private cd: ChangeDetectorRef) { 
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log(this.chartOptions);
    //this.chart = changes.chartOptions.currentValue;
    // console.log(changes)
    this.cd.markForCheck();
  }

  ngOnInit() {
    this.chart = this.chartOptions;
    this.cd.markForCheck();
  }

}
