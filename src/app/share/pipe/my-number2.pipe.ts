import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'myNumber2'
})
export class Number2Pipe implements PipeTransform {

    constructor(private decimalPipe: DecimalPipe) { }
    transform(value: any, format: string): any {
        if (typeof value === 'number') {
            const val = this.decimalPipe.transform(value, format).replace(/\.00$/,'');
            return val;
        } else if(typeof value === 'string'){
            const data = this.decimalPipe.transform(parseFloat(value), format);
            return (parseFloat(data) >= 0) ? data : "0.00";
        } else {
            return "---";
        }
    }
}
