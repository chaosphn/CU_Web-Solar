import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { DataRecords } from '../../core/stores/last-values/dashboard/dashboard-last-values.model';
import { DashboardRequestStateModel } from '../../core/stores/requests/dashboard/dashboard-request.model';
import { TagsState } from '../../core/stores/tags/tags.state';
import { ValueType } from '../../share/models/value-models/value-type.model';

@Injectable({
    providedIn: 'root'
})
export class MockDataService {

    constructor(private store: Store,  private datePipe: DatePipe) {
    }

    async readMockDataHis(req: DashboardRequestStateModel[]): Promise<any> {
        const his = req.filter(x => x.Mode !== ValueType.RealTime);
        const resHis = this.mockHistoriesData(his);
        const res = [...resHis];
        return res;
    }

    async readMockData(req: DashboardRequestStateModel[]): Promise<any[]> {
        const currs = req.filter(x => x.Mode === ValueType.RealTime || x.Mode === ValueType.AtTime);
        const his = req.filter(x => x.Mode !== ValueType.RealTime);
        const res: any[] = [];
        if (currs.length > 0) {
            currs.forEach(curr => {
                const resCurrs = this.mockCurrentData(curr);
                res.push(resCurrs);
            });
        }
        if (his.length > 0) {
            const resHis = this.mockHistoriesData(his);
            res.push(...resHis);
        }        
        return res;
    }

    private mockCurrentData(reqCur: DashboardRequestStateModel): ResponsesData {
        const items: ResponeItems[] = [];
        const tags = this.store.selectSnapshot(TagsState);
        reqCur.ItemIds.forEach(x => {
            const tagName = tags.find(t => t.Id === x).Name;
            items.push({
                    Id: x,
                    Name: tagName || '',
                    DataRecords: [
                        {
                            Timestamp: this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'),
                            Quality: 'Good',
                            Value: this.getRandomNumber()
                        }
                    ]
                });
        });
        const res: ResponsesData = {
            Id: reqCur.RequestId,
            Items: items
        };

        return res;
    }

    private mockHistoriesData(reqHis: DashboardRequestStateModel[]): ResponsesData[] {
        const res: ResponsesData[] = [];
        const tags = this.store.selectSnapshot(TagsState);
        reqHis.forEach(req => {
            const r1: ResponsesData = {
                Id: req.RequestId
            };
            const items: ResponeItems[] = [];

            req.ItemIds.forEach(x1 => {
                const tagName = tags.find(t => t.Id === x1).Name;
                const dataRecords = this.randomHistories(new Date(req.StartTime), new  Date(req.EndTime));
                items.push({
                    Id: x1,
                    Name: tagName,
                    DataRecords: dataRecords
                });
            });
            r1.Items = items;
            res.push(r1);
        });
        return res;
    }

    private getRandomNumber() {
        return Math.floor(Math.random() * Math.floor(10000)).toString();
    }

    private randomHistories(startTime: Date, endTime: Date):  DataRecords[] {
        const difference = endTime.getTime() - startTime.getTime(); 
        const resultInMinutes = Math.round(difference / 60000);
        const dataRescords: DataRecords[] = [];
        for (let i = 1; i <= resultInMinutes; i++) {
            // const _time = new Date();
            const _time = new Date(startTime.getTime() + i * 60000);

            dataRescords.push({
                Timestamp: this.datePipe.transform(_time, 'yyyy-MM-ddTHH:mm:ss'),
                Quality: 'Good',
                Value: this.getRandomNumber()
            });
        }
        return dataRescords;
    }
    
}

export interface ResponsesData {
    Id: string;
    Items?: ResponeItems[];
}

export interface ResponeItems {
    Id: number;
    Name: string;
    DataRecords: DataRecords[];
}
