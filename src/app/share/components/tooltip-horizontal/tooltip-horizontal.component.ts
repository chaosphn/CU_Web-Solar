import { ChangeDetectionStrategy, Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-tooltip-horizontal',
  templateUrl: './tooltip-horizontal.component.html',
  styleUrls: ['./tooltip-horizontal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipHorizontalComponent implements OnInit, OnChanges {

  @Input() title: string = "Zone"; 
  @Input() titleText: string = "Xxx 1";

  @Input() imgSrc: string;

  @Input() g1Title: string;
  @Input() g1Value: number;
  @Input() g1Unit: string;

  @Input() g2Title: string;
  @Input() g2Value: number;
  @Input() g2Unit: string;

  @Input() display: boolean = true;
  @Input() classDisplay: string = "left";
  constructor() { }

  ngOnInit() {
    //console.log("OnInit state : "+this.classDisplay);
    // const tooltip = document.getElementById('tooltip1') as HTMLElement;
    // tooltip.classList.add('active');
    // setTimeout(() =>{
    //   this.changeClass();
    // },1500);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const element = Array.from(document.querySelectorAll('#tooltip1'));
    element.forEach(item => {
      item.classList.add('active');
    })
    setTimeout(() =>{
      this.changeClass();
    },1500);
    //console.log("OnChanges state : "+this.classDisplay)
  }

  changeClass() {
    const element = Array.from(document.querySelectorAll('#tooltip1'));
    element.forEach(item => {
      item.classList.remove('active');
    })
  }
  

}
