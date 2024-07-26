import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fixPoint'
})
export class FixPointPipe implements PipeTransform {

    constructor(private decimalPipe: DecimalPipe) { }
    transform(value: any, pt: number): any {
        if (typeof value === 'number') {
            const val = value.toFixed(pt);
            return val;
        } else if(typeof value === 'string'){
            const data = parseFloat(value.replace(',','')).toFixed(pt);
            return (parseFloat(data) > 0) ? data : "---";
        } else {
            return "---";
        }
    }
}
