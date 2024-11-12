import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-header-information',
  templateUrl: './header-information.component.html',
  styleUrls: ['./header-information.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderInformationComponent implements OnInit, OnChanges {

  @Input() g1Image: string;
  @Input() g1Title: string;
  @Input() g1Value: string;
  @Input() g1Unit: string;

  @Input() g2Image: string;
  @Input() g2Title: string;
  @Input() g2Value: string;
  @Input() g2Unit: string;

  @Input() g3Image: string;
  @Input() g3Title: string;
  @Input() g3Value: string;
  @Input() g3Unit: string;

  @Input() g4Image: string;
  @Input() g4Title: string;
  @Input() g4Value: string;
  @Input() g4Unit: string;
  

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    
  }

  ngOnInit() {
  }



}
