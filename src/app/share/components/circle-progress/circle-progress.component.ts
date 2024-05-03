import { Component, OnInit, Input, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-circle-progress',
  templateUrl: './circle-progress.component.html',
  styleUrls: ['./circle-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleProgressComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild('circle')
  circle: ElementRef;
  @Input() Ids: string;
  @Input() title: string;
  @Input() value: number;
  @Input() unit: string;
  @Input() maxValue: number;
  @Input() percentValue: number;
  @Input() titleFont: string;
  @Input() valueFont: string;
  @Input() unitFont: string;
  progressStartValue: number = 0;
  progressEndValues: number = 0;
  constructor() { }

  ngOnInit() {
    //this.setProgressValue();
  }

  setValueBar(value:number,max:number){
    let setBar:number = 1;
    if (value && max) {
      setBar = value*100/max;
    }
    
    // console.log(setBar)
    return setBar;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const circularProgress1 = document.getElementById(this.Ids) as HTMLElement;
    this.percentValue = this.setValueBar(this.value,this.maxValue)
    if (this.percentValue >= 0 && circularProgress1) {
      // this.progressStartValue = this.percentValue;
      this.setProgressValue();
    }


  }

  ngAfterViewInit(): void {
    this.setProgressValue();
    // console.log('XXX')
  }

  setProgressValue() {
    if (this.percentValue >= 0) {
      const circularProgress1 = document.getElementById(this.Ids) as HTMLElement;
      const speed = 0;
      const progressEndValue = this.percentValue;
      let progress = setInterval(() => {
        this.progressStartValue++;
        circularProgress1.style.background = `conic-gradient( #3db1fc ${this.percentValue *3.6}deg, rgba(0, 0, 0, 0.1) 0deg)`;
        if (this.progressStartValue == 100) {
          clearInterval(progress);
          // console.log(this.percentValue)
          // console.log(this.progressStartValue)
        }
      }, speed);

    }
    // console.log("this.Ids:", this.Ids);
    // console.log("circularProgress1:", circularProgress1);
  }

}
