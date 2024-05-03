import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ChartModule, Highcharts, HIGHCHARTS_MODULES } from 'angular-highcharts';
import exporting from 'highcharts/modules/exporting.src';

@NgModule({
    imports: [
        CommonModule,
        ChartModule
    ],
    exports: [
        ChartModule
    ],
    providers: [
        {
            provide: HIGHCHARTS_MODULES, useFactory: highchartModules
        }
    ]
})
export class HighchartModules {
    constructor() {
        Highcharts.setOptions({
            global: {
                useUTC: false
            },
            lang: {
                thousandsSep: ',',
                resetZoom: 'Unzoom'
            },
        });
    }
}

export function highchartModules() {
    return [exporting];
}
