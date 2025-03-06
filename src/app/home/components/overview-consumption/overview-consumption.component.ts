import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngxs/store';
import { LocationStateModel } from 'src/app/core/stores/location/location.model';
import { AddZone } from 'src/app/core/stores/location/location.state';
import { SingleValue1 } from 'src/app/share/models/value-models/group-data.model';

@Component({
  selector: 'app-overview-consumption',
  templateUrl: './overview-consumption.component.html',
  styleUrls: ['./overview-consumption.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewConsumptionComponent implements OnInit, OnDestroy, OnChanges {

  @Input() zone: LocationStateModel;
  @Input() data: SingleValue1;
  @Output() zoneDisplay = new EventEmitter<string>();

  @ViewChild('overviewContainer') cardContainer!: ElementRef;

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  autoScrollInterval: any;
  timerInterval: any;
  scrollPaused: boolean = false;
  isDragging: boolean = false;
  startX: number = 0;
  scrollLeft: number = 0;
  time: string = '00:00:00';
  date: Date = new Date();

  ngOnChanges(changes: SimpleChanges): void {
    this.resetScroll();
    //console.log(this.data)
    //this.cd.markForCheck();
  }

  ngOnInit(): void {
    this.startAutoScroll();
    //this.startAutoTimer();
  }

  ngOnDestroy(): void {
    this.clearAutoScroll();
  }

  startAutoScroll() {
    let count = 0;
    let cardIndex = 0;
    this.autoScrollInterval = setInterval(() => {
      if (!this.scrollPaused) {
        this.autoScroll();
      } else {
        count++;
      }
      if(count>=6){
        this.scrollPaused = false;
      }
    }, 10000); 
  }

  nextScroll(){
    this.pauseAutoScroll()
    const container = this.cardContainer.nativeElement;
    //console.log(container)
    if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
      container.scrollLeft = 0; 
    } else {
      container.scrollLeft += container.clientWidth; 
    }
  }

  previousScroll(){
    this.pauseAutoScroll()
    const container = this.cardContainer.nativeElement;
    //console.log(container)
    if (container.scrollLeft - container.clientWidth >= container.scrollWidth) {
      container.scrollLeft = 0; 
    } else {
      container.scrollLeft -= container.clientWidth; 
    }
  }

  startAutoTimer() {
    this.timerInterval = setInterval(() => {
      let now = new Date();
      //this.time = this.dateTimeSrv.getDateTime(now).substring(11, 19);
      this.date = now;
      this.cd.markForCheck();
    }, 1000);
  }

  onVisibilityChange(isVisible: boolean, item: any) {
    if (isVisible) {
      //console.log(item.id);
      this.zoneDisplay.emit(item.id);
    } else {
      //console.log(`${item} is not visible`);
    }
  }

  onScroll() {
    //console.log('Scrolled!');
  }

  autoScroll() {
    const container = this.cardContainer.nativeElement;
    //console.log(container)
    if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
      container.scrollLeft = 0; 
    } else {
      container.scrollLeft += container.clientWidth; 
    }
  }

  resetScroll(){
    if(this.cardContainer && this.cardContainer.nativeElement){
      const container = this.cardContainer.nativeElement;
      container.scrollLeft = 0;
    }
  }

  clearAutoScroll() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
    if(this.timerInterval){
      clearInterval(this.timerInterval);
    }
  }

  pauseAutoScroll() {
    this.scrollPaused = true;
  }

  resumeAutoScroll() {
    this.scrollPaused = false;
  }

  onDragStart(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.pageX - this.cardContainer.nativeElement.offsetLeft;
    this.scrollLeft = this.cardContainer.nativeElement.scrollLeft;
  }
  
  onDragMove(event: MouseEvent) {
    if (!this.isDragging) return;
    event.preventDefault();
    const x = event.pageX - this.cardContainer.nativeElement.offsetLeft;
    const walk = x - this.startX;
    this.cardContainer.nativeElement.scrollLeft = this.scrollLeft - walk;
  }
  
  onDragEnd() {
    this.isDragging = false;
  }

  getPercentage(variant1?: number, variant2?: number){
    if(variant1 > 0 && variant2 > 0){
      return (((variant1)/(variant1+variant2))*100);
    } else if( variant1 > 0 && variant2 <= 0 ){
      return 100;
    } else if( variant1 > 0 && !variant2 ){
      return 100;
    } else {
      return 0;
    }
  }

}
