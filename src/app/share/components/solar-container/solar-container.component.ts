import { ChangeDetectionStrategy, Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-solar-container',
  templateUrl: './solar-container.component.html',
  styleUrls: ['./solar-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SolarContainerComponent implements OnInit {

  @Input() title: string;
  @ContentChild('content') contentTmpl: TemplateRef<any>;
  @ContentChild('period') periodTmpl: TemplateRef<any>;

  constructor() { }

  ngOnInit() {
  }

}
