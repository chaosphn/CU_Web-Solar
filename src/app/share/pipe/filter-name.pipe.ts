import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterName'
})
export class FilterNamePipe implements PipeTransform {
  constructor() { }
  transform(array: any[], field: string): any[] {
    if (!Array.isArray(array)) {
      return [];
    }
    if(field){
      array.filter(x => x.name.toLowerCase().includes(field.toLocaleLowerCase()));
    }
    return array;
  }
}
