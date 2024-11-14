import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngxs/store';
import { LocationStateModel } from 'src/app/core/stores/location/location.model';
import { AddZone } from 'src/app/core/stores/location/location.state';
import { DateTimeService } from 'src/app/share/services/datetime.service';

@Component({
  selector: 'app-footer-infomation',
  templateUrl: './footer-infomation.component.html',
  styleUrls: ['./footer-infomation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterInfomationComponent implements OnInit, OnDestroy, OnChanges {

  @ViewChild('cardContainer') cardContainer!: ElementRef;
  @Input() config: LocationStateModel[] = [];
  @Input() zone: LocationStateModel;
  constructor(private dateTimeSrv: DateTimeService,
    private cd: ChangeDetectorRef,
    private store: Store
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
    //console.log(this.config)
  }

  ngOnInit(): void {
    this.startAutoScroll();
    this.startAutoTimer();
  }

  ngOnDestroy(): void {
    this.clearAutoScroll();
  }

  async updateLocation(name: string){
    const zone = this.config.find(x => x.zone == name);
    if(zone){
      await this.store.dispatch(new AddZone(zone)).toPromise();
    }
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
      this.time = this.dateTimeSrv.getDateTime(now).substring(11, 19);
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
