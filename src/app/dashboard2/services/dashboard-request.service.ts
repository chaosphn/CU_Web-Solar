import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { UUID } from 'angular2-uuid';
import { DashboardReqHistorian, DashboardReqRealtime, DashboardRequestStateModel } from '../../core/stores/requests/dashboard/dashboard-request.model';
import { TagsStateModel } from '../../core/stores/tags/tags.model';
import { TagsState } from '../../core/stores/tags/tags.state';
import { DashboardConfigStateModel, DashboardConfigsHistorian, DashboardConfigsRealtime, InverterTag, PlotTag, RawTag } from './../../core/stores/configs/dashboard/dashboard-configs.model';
import { ValueType } from './../../share/models/value-models/value-type.model';
import { DateTimeService } from './../../share/services/datetime.service';

@Injectable({
    providedIn: 'root'
})

export class DashboardRequestService {

    constructor(private store: Store,
        private dateTimeService: DateTimeService) { }

    createRequest(dashboardConfigs: DashboardConfigStateModel[]): DashboardRequestStateModel[] {
        const requests = this.genRequest(dashboardConfigs);
        return requests;
    }

    createRealtimeRequest(configs: DashboardConfigsRealtime[]): DashboardReqRealtime {
        let requests: DashboardReqRealtime = {
        Tags: []
        }
        configs.forEach((item)=>{
        //console.log(item);
        requests.Tags.push(item.Name);
        });
        //console.log(requests);
        return requests;
    }

    createHistorianRequest(configs: DashboardConfigsHistorian[]): DashboardReqHistorian[] {
        let requests: DashboardReqHistorian[] = []
        configs.forEach((item)=>{
           let tag = {
            Name: item.Name,
            Options: item.Options 
           }
           requests.push(tag);
        });
        //console.log(requests);
        return requests;
   }


    createInverterRequest(dashboardConfigs: DashboardConfigStateModel): DashboardRequestStateModel[] {

        const today = this.dateTimeService.parseDate('t').startTime;
        const now = this.dateTimeService.getDateTime(new Date());
        const uuid1 = 's_inverterToday';
        const uuid2 = 's_inverterNow';
        const inverterTags: InverterTag[] = dashboardConfigs.tags;
        const tagNames = inverterTags.map(c => c.name);
        const tags: TagsStateModel[] = this.store.selectSnapshot(TagsState.getTagIds(tagNames));
        const tagIds = tags.map(t => t.Id);

        const req1: DashboardRequestStateModel = {
            RequestId: uuid1,
            Mode: ValueType.AtTime,
            ItemIds: tagIds,
            Timestamp: today,
        };
        const req2: DashboardRequestStateModel = {
            RequestId: uuid2,
            Mode: ValueType.AtTime,
            ItemIds: tagIds,
            Timestamp: now,
        };
        return [req1, req2];
    }

    private genRequest(dashboardConfigs: DashboardConfigStateModel[]): DashboardRequestStateModel[] {
        const currReq: DashboardRequestStateModel = this.getCurrentConfig(dashboardConfigs);
        const atTimeReq: DashboardRequestStateModel[] = this.getAtTimeConfig(dashboardConfigs);
        const plotReqs: DashboardRequestStateModel[] = this.getPlotConfigs(dashboardConfigs);
        const rawReqs: DashboardRequestStateModel[] = this.getRawConfigs(dashboardConfigs);
        const requests: DashboardRequestStateModel[] = [currReq, ...atTimeReq, ...plotReqs, ...rawReqs];
        return requests;
    }

    private getCurrentConfig(dashboardConfigs: DashboardConfigStateModel[]): DashboardRequestStateModel {
        const currConfigs = dashboardConfigs.filter(c => c.type === ValueType.RealTime);
        const uuid = UUID.UUID();
        const id = uuid;
        const type = ValueType.RealTime;
        const tagNames = currConfigs.map(c => c.tagName);
        const tags: TagsStateModel[] = this.store.selectSnapshot(TagsState.getTagIds(tagNames));
        const tagIds = tags.map(x => x.Id) || [];

        const req: DashboardRequestStateModel = {
            RequestId: id,
            Mode: type,
            ItemIds: tagIds,
        };
        return req;
    }

    private getAtTimeConfig(dashboardConfigs: DashboardConfigStateModel[]): DashboardRequestStateModel[] {

        const atTimeConfigs = dashboardConfigs.filter(c => c.type === ValueType.AtTime);
        const requests: DashboardRequestStateModel[] = [];
        atTimeConfigs.forEach(config => {
            if (config.options && config.options.timestamp) {
                const timestamp = this.dateTimeService.getTime(config.options.timestamp);
                const uuid = UUID.UUID();
                const id = uuid;
                const type = ValueType.AtTime;
                const tag: TagsStateModel = this.store.selectSnapshot(TagsState.getTagId(config.tagName));
                const StartTime = this.dateTimeService.getToday();
                if (tag) {
                    const req: DashboardRequestStateModel = {
                        RequestId: config.name,
                        Mode: type,
                        ItemIds: [tag.Id],
                        // StartTime: StartTime,
                        Timestamp: timestamp
                    };
                    requests.push(req);
                }
            }
        });
        return requests;
    }

   

    private getPlotConfigs(dashboardConfigs: DashboardConfigStateModel[]): DashboardRequestStateModel[] {
        const requests: DashboardRequestStateModel[] = [];
        const historiesConfigs = dashboardConfigs.filter(c => c.type === ValueType.Plot);
        historiesConfigs.forEach(config => {
            const periodName = (config && config.options && config.options.runtimeConfigs) ? config.options.runtimeConfigs.periodName : 't';
            const reqId = config.name;
            const type = ValueType.Plot;
            const period = this.dateTimeService.parseDate(periodName);
            const plotTags: PlotTag[] = config.tags as PlotTag[];
            const tagNames = plotTags.map(x => x.name);
            const tags: TagsStateModel[] = this.store.selectSnapshot(TagsState.getTagIds(tagNames));
            const tagIds = tags.map(t => t.Id);
            const req: DashboardRequestStateModel = {
                RequestId: reqId,
                Mode: type,
                ItemIds: tagIds,
                StartTime: period.startTime,
                EndTime: period.endTime,
                Interval: config.interval
            };
            requests.push(req);

        });
        return requests;
    }

    private getRawConfigs(dashboardConfigs: DashboardConfigStateModel[]): DashboardRequestStateModel[] {
        const requests: DashboardRequestStateModel[] = [];
        const historiesConfigs = dashboardConfigs.filter(c => c.type === ValueType.Raw);
        historiesConfigs.forEach(config => {
            const periodName = (config && config.options && config.options.runtimeConfigs) ? config.options.runtimeConfigs.periodName : 't';
            const reqId = config.name;
            const type = ValueType.Raw;
            const period = this.dateTimeService.parseDate(periodName);
            const rawTags: RawTag[] = config.tags as RawTag[];
            const tagNames = rawTags.filter(x => x.period === periodName).map(x => x.name);
            const tags: TagsStateModel[] = this.store.selectSnapshot(TagsState.getTagIds(tagNames));
            const tagIds = tags.map(t => t.Id);

            // const mockStartTime = new Date();
            // const mockEndTime = new Date();

            // mockStartTime.setMinutes(mockStartTime.getMinutes() - 0.5);

            const req: DashboardRequestStateModel = {
                RequestId: reqId,
                Mode: type,
                ItemIds: tagIds,
                StartTime: period.startTime,
                EndTime: period.endTime
            };
            requests.push(req);

        });
        return requests;
    }

}
