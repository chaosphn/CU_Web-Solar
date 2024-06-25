import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartOptions } from '../../models/chart-options.model';
import { MatDialog } from '@angular/material';
import { DiagramComponent } from 'src/app/diagram/diagram.component';
import { DialogbreakerComponent } from '../dialogbreaker/dialogbreaker.component';
import { BuildingModel } from 'src/app/core/stores/sites/sites.model';



@Component({
  selector: 'app-card-breaker',
  templateUrl: './card-breaker.component.html',
  styleUrls: ['./card-breaker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardBreakerComponent implements OnInit, OnChanges {

  @Input() header: string;
  @Input() cbStatus: string;
  @Input() site: BuildingModel;
  chart: ChartOptions = {};
  checkStatus: boolean = false;
  constructor(private cd: ChangeDetectorRef,
    public dialog: MatDialog
  ) { 
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.cbStatus && this.cbStatus == "0"){
      this.checkStatus = true;
    } else {
      this.checkStatus = false;
    }
    this.cd.markForCheck();
  }

  ngOnInit() {
   
  }

  getBreakerStatus(){
    if(this.cbStatus){ if(this.cbStatus == "1"){return "ON"}else{return "OFF"} } else {return "NULL"}
  }

  openBreaker() {
    const dialogRef = this.dialog.open(DialogbreakerComponent, {
      width: '650px',
      data: this.site,
      backdropClass: 'dialog-backdrop',
      panelClass: ['dialog-panel']
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  setTestBreaker(){
    this.cbStatus = "0";
    this.checkStatus = true;
  }

}
