import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'myNumber'
})
export class MyNumberPipe implements PipeTransform {

    constructor(private decimalPipe: DecimalPipe) { }
    transform(value: any, format: string): any {
        if (typeof value === 'number') {
            const val = this.decimalPipe.transform(value, format);
            return val;
        } else if(typeof value === 'string'){
            const data = this.decimalPipe.transform(parseFloat(value.replace(',','')), format);
            return (parseInt(data) >= 0) ? parseFloat(data.replace(',','')) : "---";
        } else {
            return "---";
        }
    }
}
