import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-daily-consumption2',
  templateUrl: './daily-consumption.component.html',
  styleUrls: ['./daily-consumption.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DailyConsumptionComponent2 implements OnInit, OnChanges {

  @Input() title: string;
  @Input() minValue: number;
  @Input() maxValue: number;
  @Input() actualValue: number;
  @Input() actualUnit: string;
  @Input() expectText: string;
  @Input() expectValue: number;
  @Input() expectUnit: string;

  @Input() g1Title: string;
  @Input() g1Value: any;
  @Input() g1Unit: string;

  @Input() g2Title: string;
  @Input() g2Value: number;
  @Input() g2Unit: string;

  @Input() g3Title: string;
  @Input() g3Value: number;
  @Input() g3Unit: string;

  @Input() g4Title: string;
  @Input() g4Value: number;
  @Input() g4Unit: string;

  @Input() r2g1Title: string;
  @Input() r2g1Value: any;
  @Input() r2g1Unit: string;

  @Input() r2g1vTitle: string;
  @Input() r2g1vValue: any;
  @Input() r2g1vUnit: string;

  @Input() r2g2Title: string;
  @Input() r2g2Value: any;
  @Input() r2g2Unit: string;

  @Input() r2g2vTitle: string;
  @Input() r2g2vValue: any;
  @Input() r2g2vUnit: string;

  @Input() showArrow = true;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    
  }

  getCalRange(){
    if(this.expectValue > this.maxValue){
      return ((this.maxValue * 70) / this.maxValue) ? 'calc(' + (((this.maxValue * 70) / this.maxValue) + 10) + '% - 40px)' : 'calc(' + (10) + '% - 40px)';
    } else {
      return ((this.expectValue * 70) / this.maxValue) ? 'calc(' + (((this.expectValue * 70) / this.maxValue) + 10) + '% - 40px)' : 'calc(' + (10) + '% - 40px)';
    }
  }

  getBarValue(){
    return ((this.actualValue * 70) / this.maxValue) ? ((this.actualValue * 70) / this.maxValue) : 0;
  }


  getNumber(val) {
    if (typeof val === 'number') {
      const v = +val.toFixed(2);
      return v;
    }
    else {
      const v = parseFloat(val).toFixed(2);
      //console.log(typeof v);
      if( v === 'NaN'){
        return val;
      } else {
        return v;
      }
    }
  }

}
