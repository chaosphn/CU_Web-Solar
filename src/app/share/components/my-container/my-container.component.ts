import { ChangeDetectionStrategy, Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-my-container',
  templateUrl: './my-container.component.html',
  styleUrls: ['./my-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyContainerComponent implements OnInit {

  @Input() title: string;
  @ContentChild('content1') contentTmpl: TemplateRef<any>;
  @ContentChild('period') periodTmpl: TemplateRef<any>;

  constructor() { }

  ngOnInit() {
  }

}
