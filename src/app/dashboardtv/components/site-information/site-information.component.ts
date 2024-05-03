import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-site-information',
  templateUrl: './site-information.component.html',
  styleUrls: ['./site-information.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SiteInformationComponent implements OnInit {

  @Input() name: string;
  @Input() location: string;
  @Input() capacityValue: string;
  @Input() capacityUnit: string;
  @Input() cod: string;
  @Input() firstsync: string
  today;

  constructor(private dataPipe:DatePipe) { }

  ngOnInit() {
    this.getDate();
  }

  getDate(){
    let day = Date.now();
    this.today = this.dataPipe.transform(day,'dd MMM yy');
  }

}
