import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-overview-consumption',
  templateUrl: './overview-consumption.component.html',
  styleUrls: ['./overview-consumption.component.scss']
})
export class OverviewConsumptionComponent implements OnInit, OnDestroy {

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

  ngOnInit(): void {
    this.startAutoScroll();
    //this.startAutoTimer();
  }

  ngOnDestroy(): void {
    this.clearAutoScroll();
  }

  startAutoScroll() {
    let count = 0;
    this.autoScrollInterval = setInterval(() => {
      if (!this.scrollPaused) {
        this.autoScroll();
      } else {
        count++;
      }
      if(count>=6){
        this.scrollPaused = false;
      }
    }, 5000); 
  }

  startAutoTimer() {
    this.timerInterval = setInterval(() => {
      let now = new Date();
      //this.time = this.dateTimeSrv.getDateTime(now).substring(11, 19);
      this.date = now;
      this.cd.markForCheck();
    }, 1000);
  }

  autoScroll() {
    const container = this.cardContainer.nativeElement;
    if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
      container.scrollLeft = 0; 
    } else {
      container.scrollLeft += container.clientWidth; 
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

}