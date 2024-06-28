import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'report'
})
export class ReportPipe implements PipeTransform {

    constructor(private decimalPipe: DecimalPipe) { }
    transform(value: any, format: number): any {
        if (typeof value === 'number') {
            const val = value.toFixed(format);
            return val;
        } else if(typeof value === 'string'){
            const data = parseFloat(value.replace(',','')).toFixed(format);
            return (parseFloat(data) >= 0) ? data : "0.00";
        } else {
            return "---";
        }
    }
}
