import { Injectable } from '@angular/core';
import { DashboardLastValuesStateModel, DashboardResHistorian } from 'src/app/core/stores/last-values/dashboard/dashboard-last-values.model';
import { DashboardReqHistorian, DashboardRequestStateModel } from 'src/app/core/stores/requests/dashboard/dashboard-request.model';

@Injectable({
    providedIn: 'root'
})
export class DashboardInverterService {
    periodName: string = 't';
    data: DashboardResHistorian[];
    config: any;
    requests: DashboardReqHistorian[];

    constructor() { }

    generateInverterValues(): InverterValue[] {
        const inverters: InverterValue[] = [];
        const categories: string[] = this.config.options.chartOptions.xAxis.categories;
        categories.forEach(c => {
            const tagName = this.getTagName(c);
            if (tagName) {
                const inv = this.getValue(tagName, c);
                inverters.push(inv);
            }
        });
        console.log(inverters)
        return inverters;                      
    }

    getTagName(name: string): string {
        const tag = this.config.tags.find(c => c.title === name);
        return (tag) ? tag.name : null;
    }

    getValue(tagName: string, name: string): InverterValue {
        const inverter: InverterValue = { 
            Name: name
        };

        if (this.data) {
            const today = this.data.find(x => x.Name === tagName);
            if (today && today.records.length > 0) {
                const diff = (+today.records[today.records.length - 1].Value) - (+today.records[0].Value);
                // console.log("Stat Data : "+today.records[0].Value
                // +"\nEnd Time :" + today.records[0].TimeStamp);
                // console.log("End Data : " +today.records[today.records.length - 1].Value
                // +"\nEnd Time :" + today.records[today.records.length - 1].TimeStamp);
                inverter.Name = name;
                inverter.Timestamp = today.records[0].TimeStamp;
                inverter.Value = Math.abs(diff).toFixed(4).toString()/*'500'*/;
                inverter.Quality = 'Good';
                return inverter;
            }
        }
        return null;
    }
}

export interface InverterValue {
    Name: string;
    Value?: string;
    Timestamp?: string;
    Quality?: string;
}
