import { Component, OnInit, ChangeDetectionStrategy, ContentChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-cu-container',
  templateUrl: './cu-container.component.html',
  styleUrls: ['./cu-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CuContainerComponent implements OnInit {
  @ContentChild('gradient') containerTmp: TemplateRef<any>;

  constructor() { }

  ngOnInit() {
  }

}
