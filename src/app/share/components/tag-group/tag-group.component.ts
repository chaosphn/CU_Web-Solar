import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AliasItem, Group, TagGrouping } from '../../models/tag-group.model';

@Component({
  selector: 'app-tag-group',
  templateUrl: './tag-group.component.html',
  styleUrls: ['./tag-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagGroupComponent implements OnInit, OnChanges {

  height = '294px';
  @Input() groupConfig: TagGrouping[] = [];
  groups: Group[] = [];
  alias: AliasItem[] = [];
  @Output() selectTags = new EventEmitter();


  constructor(private cd: ChangeDetectorRef) {
    
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.groups = [];
    this.alias = [];
    if (this.groupConfig) {
      //console.log(this.Config[0])
      this.groupConfig.forEach((x, index) => {
        x.Groups.forEach((item)=>{
          this.groups.push(item);
        })
        x.Aliases.forEach((item)=>{
          this.alias.push(item);
        })
      });
      // console.log(this.groupConfig);
      // console.log(this.alias);
      this.cd.markForCheck();
    }
  }


  getWidth(itemLength: number): string {
    if (itemLength !== 0) {
      const width = Math.ceil(itemLength / 11) * 77;
      return width + 'px';
    }
    return null;
  }

  selectAlias(alias: AliasItem) {
    // const checkGroup = this.groups.find(x => x.active);
    // if (checkGroup) {
      alias.active = !alias.active;
      this.emitTag();
    // }
  }

  selectGroup(group: Group) {
    group.active = !group.active;
    const groupActived = this.groups.find(x => x.active);
    if (!groupActived) {
      this.alias.filter(x => x.active).forEach(x => x.active = false);
    }
    this.emitTag();

  }

  emitTag() {
    const tagNames: string[] = [];
    const groupNames = this.groups.filter(x => x.active).map(x => x.Display);
    const aliasNames = this.alias.filter(x => x.active).map(x => x.Display);
    if (groupNames.length > 0 && aliasNames.length > 0) {
      groupNames.forEach(g => {
        aliasNames.forEach(a => {
          tagNames.push(g + '.' + a);
        });
      });
    }
    // if (tagNames.length > 0) {
      console.log(tagNames)
      this.selectTags.emit(tagNames);
    // }
  }

  selectAll() {
    const checkgroups = this.groups.find(x => !x.active);
    const checkalias = this.alias.find(x => !x.active);
    
    if (checkgroups || checkalias) {
      this.groups.forEach(x => {
        x.active = true;
      });
      this.alias.forEach(x => {
        x.active = true;
      });
    }
    else {
      this.groups.forEach(x => {
        x.active = false;
      });
      this.alias.forEach(x => {
        x.active = false;
      });
    }

    this.emitTag();
    this.cd.markForCheck();
  }

  selectAllGroup() {
    const groupNotActive = this.groups.filter(x => !x.active);

    if (groupNotActive.length > 0) {
      groupNotActive.forEach(x => x.active = true);
    }
    else {
      this.groups.forEach(x => x.active = false);
      this.clearAliasItems();
    }
    this.emitTag();
  } 

  selectAllAlias() {
    if (this.groups.find(x => x.active)) {
      const aliasNotActive = this.alias.filter(x => !x.active);

      if (aliasNotActive.length > 0) {
        aliasNotActive.forEach(x => x.active = true);
      }
      else {
        this.alias.forEach(x => x.active = false);
      }
    }
    this.emitTag();
  }

  clearAliasItems() {
    this.alias.filter(x => x.active).forEach(x => x.active = false);
  }


  getGroupActive(): boolean {
    if (this.groups.find(x => !x.active)) {
      return false;
    }
    return true;
  }
  

  getAliasActive(): boolean {
    if (this.alias.find(x => !x.active)) {
      return false;
    }
    return true;
  }
}
