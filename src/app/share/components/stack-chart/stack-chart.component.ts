import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnChanges, SimpleChanges } from '@angular/core';



@Component({
  selector: 'app-stack-chart',
  templateUrl: './stack-chart.component.html',
  styleUrls: ['./stack-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StackChartComponent implements OnInit, OnChanges {

  @Input() value: number;
  @Input() unit: string;
  @Input() data: number;
  @Input() minVal: number;
  @Input() maxVal: number;
  @Input() activeColor: string ;
  @Input() bgColor: string ;
  @Input() bdRadius: string ;
  @Input() rangeVal: number = 10;
  @Input() label: string;
  @Input() subLabel: string;
  @Input() subTitle: string;
  range: number = 20;
  active: string = "#69EDFF"; 
  bg: string = "rgba(0, 0, 0, 0.05)";
  radius: string = '5px';
  showItems: boolean[] = [];
  initItem: number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  chartItems: number[] = [];
  constructor(private cd: ChangeDetectorRef) { 
    
  }

  
  ngOnChanges(changes: SimpleChanges): void {
    const percentValue = this.getPercentage();
    this.range = this.setRange();
    this.chartItems = Array(this.range).fill(0).map((_, i) => i);
    // console.log(percentValue)
  }


  ngOnInit() {
    //this.getColor(0);
    // const test = this.getPercentage();
    // this.range = this.setRange();
    // this.chartItems = Array(this.range).fill(0).map((_, i) => i);
  }
  

  setActiveColor(): string{
    if(this.activeColor){
      return this.activeColor;
    } else {
      return this.active;
    }
  }

  setBgColor(): string{
    if(this.bgColor){
      return this.bgColor;
    } else {
      return this.bg;
    }
  }

  setRange(): number{
    if(this.rangeVal){
      return this.rangeVal;
    } else {
      return 10;
    }
  }

  getPercentage(): number{
    if(this.value && this.maxVal){
      const percent = ((this.value/this.maxVal)*this.rangeVal).toFixed(0);
      return parseFloat(percent);
    } else {
      return 0;
    }
  }

  getColor(index: number): string {
    const atcColor = this.setActiveColor();
    const bgColor = this.setBgColor();
    let count = 0;
    let setData = setInterval(()=> {
      count++;
      if(count == 90){
        clearInterval(setData);
      }
    }, 1000);
    return index < this.getPercentage() ? atcColor : bgColor;
  }

  /*&getColor(index: number): string {
    const atcColor = this.setActiveColor();
    const bgColor = this.setBgColor();
    let count = 0;
    let delay = 1000; 
    let setData = setInterval(() => {
      count++;
      if (count == 90) {
        clearInterval(setData);
        this.showItems[index] = true;
        this.cd.detectChanges(); 
      }
    }, delay);
  
    return index < this.data ? atcColor : bgColor;
  }*/
  
  showItem(index: number): boolean {
    return this.showItems[index];
  }
  


}
