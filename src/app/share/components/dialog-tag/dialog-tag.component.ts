import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NgxMasonryOptions } from 'ngx-masonry';
import { AliasItem, Group, TagGrouping } from '../../models/tag-group.model';
import { BuildingModel } from 'src/app/core/stores/sites/sites.model';
import { Store } from '@ngxs/store';
import { SitesState } from 'src/app/core/stores/sites/sites.state';

@Component({
  selector: 'app-dialog-tag',
  templateUrl: './dialog-tag.component.html',
  styleUrls: ['./dialog-tag.component.scss']
})
export class DialogTagComponent implements OnInit {

  masonryOptions: NgxMasonryOptions = {
    transitionDuration: '0s'
  };

  x: number = 0;
  y: number = 0;
  buildings: BuildingModel[] = [];
  tooltipContent: string | HTMLElement = '';

  constructor(public dialogRef: MatDialogRef<DialogTagComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TagGrouping[],
    private store: Store) { }

  ngOnInit() {
    this.buildings = this.store.selectSnapshot(SitesState.getSites());
  }


  onMouseOver(event: MouseEvent){
    this.x = event.clientX;
    this.y = event.clientY;
    console.log("mouse pos  X :" + this.x + " Y :" +this.y  );
    
  }

  getBuildingName(name: string){
    // if(name.includes("INV")){
    //   const id = name.replace("INV", "").substring(0, 2);
    //   const res = this.buildings.find(x => parseInt(x.no) == parseInt(id));
    //   if(res){
    //     return res.name;
    //   } else {
    //     return "---";
    //   }
    // } else {
    //   const id = name.split(".")[0].substring(name.length-2, name.length);
    //   const res = this.buildings.find(x => parseInt(x.no) == parseInt(id));
    //   if(res){
    //     return res.name;
    //   } else {
    //     return "---";
    //   }
    // }
    const id = name.split(".")[0].substring(name.split(".")[0].length-2, name.split(".")[0].length);
    const res = this.buildings.find(x => parseInt(x.no) == parseInt(id));
    if(res){
      return res.name;
    } else {
      return "---";
    }
  }

  selectOnceGroup(d: TagGrouping , a: AliasItem) {
    a.active = !a.active;
    const _aliasActive = d.Aliases.find(x => x.active);
    if (_aliasActive) {
      d.Groups[0].active = true;
    } else {
      d.Groups[0].active = false;
    }
  }

  selectGroup(d: TagGrouping, g: Group) {
    g.active = !g.active;
    const _groupActive = d.Groups.find(x => x.active);
    if (!_groupActive) {
      d.Aliases.forEach(x => x.active = false);
    }

  }

  selectAlias(d: TagGrouping , a: AliasItem) {
    // const _groupActive = d.Groups.find(x => x.active);
    // if (_groupActive) {
      a.active = !a.active;
    // }
  }

  selectAllOnceGroup(d: TagGrouping) {
    const notHasActive = d.Aliases.find(x => !x.active);
    if (notHasActive) {
      d.Aliases.filter(x => !x.active).forEach(x => x.active = true);
      d.Groups[0].active = true;
    }
    else {
      d.Aliases.forEach(x => x.active = false);
      d.Groups[0].active = false;
    }
  }

  selectAllGroup(d: TagGrouping) {
    const notHasActive = d.Groups.find(x => !x.active);
    if (notHasActive) {
      d.Groups.filter(x => !x.active).forEach(x => x.active = true);
    }
    else {
      d.Groups.forEach(x => x.active = false);
    }
  }

  selectAllAlias(d: TagGrouping) {
    const groupActive = d.Groups.find(x => x.active);
    if (groupActive) {
      
      const notHasActive = d.Aliases.find(x => !x.active);
      if (notHasActive) {
        d.Aliases.filter(x => !x.active).forEach(x => x.active = true);
      }
      else {
        d.Aliases.forEach(x => x.active = false);
      }
    }
  }



  close() {
    this.dialogRef.close();
  }

  selectTag() {
    const _newData = this.parseTag(this.data);
    this.dialogRef.close(_newData);
  }

  clear() {
    this.data.forEach(x => {
      x.Aliases.forEach(a => {
        a.active = false;
      });
      x.Groups.forEach(g => {
        g.active = false;
      });
    });
  }


  parseTag(data: TagGrouping[]): string[] {
    const strArr: string[] = [];
    data.forEach(d => {
      const _groupActive = d.Groups.filter(x => x.active);
      const _aliasActive = d.Aliases.filter(x => x.active);
      if (_groupActive.length > 0 && _aliasActive.length > 0) {
        _groupActive.forEach(g => {
          _aliasActive.forEach(a => {
            const fullPath = `${g.Name}.${a.Display}`;
            strArr.push(fullPath);
          });
        });
      }
    });
    return strArr;
  }

  getActiveOnceGroup(d: TagGrouping): boolean {
    const groupNotActived = d.Aliases.find(x => !x.active);
    return (groupNotActived) ? false : true;
  }

  getActiveAllGroup(d: TagGrouping): boolean {
    const groupNotActived = d.Groups.find(x => !x.active);
    return (groupNotActived) ? false : true;
  }

  getActiveAllAlias(d: TagGrouping): boolean {
    const aliasNotActived = d.Aliases.find(x => !x.active);
    return (aliasNotActived) ? false : true;
  }
}
