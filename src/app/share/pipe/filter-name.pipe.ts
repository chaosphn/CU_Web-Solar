import { Pipe, PipeTransform } from '@angular/core';
import { d } from '@angular/core/src/render3';

@Pipe({
  name: 'filterName'
})
export class FilterNamePipe implements PipeTransform {
  constructor() { }
  transform(array: any[], field: string, defualt: any[]): any[] {
    if (!Array.isArray(array)) {
      return [];
    }
    let data = array;
    console.log(defualt)
    console.log(array)
    if(field && field.length > 0 ){
       
      const xxx = data.map(function(item){
        const matches = item.name.toLowerCase().includes(field.toLowerCase());
        if(item.building){
          item.display = matches && item.display ? true : false;
        } else {
          item.display = matches && parseInt(item.no) <= 12 ? true : false;
        }
        return item;
      });
      console.log('xxxxxxxx')
      return Array.isArray(xxx) ? xxx : [];
    } else {
      console.log('yyyyyyyy')
      return defualt;
    }
  }
}
