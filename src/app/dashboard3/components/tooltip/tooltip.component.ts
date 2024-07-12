import { ChangeDetectionStrategy, Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipComponent implements OnInit, OnChanges  {

  @Input() title: string; 
  @Input() titleText: string;

  @Input() imgSrc: string;

  @Input() g1Title: string;
  @Input() g1Value: number;
  @Input() g1Unit: string;

  @Input() g2Title: string;
  @Input() g2Value: number;
  @Input() g2Unit: string;

  @Input() display: boolean = true;
  @Input() classDisplay: string = "top";
  
  @Input() cbStatus: string = '';
  @Output() emitBuilding = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
    
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

  selectBuilding(){
    if(this.title){
      this.emitBuilding.emit(this.title);
    }
  }

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/notfound.jpg';
  }
  

}
