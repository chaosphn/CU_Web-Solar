import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { UUID } from 'angular2-uuid';
import { PowerReqHistorian, PowerReqRealtime, PowerRequestStateModel } from '../../core/stores/requests/powermeter/power-request.model';
import { TagsStateModel } from '../../core/stores/tags/tags.model';
import { TagsState } from '../../core/stores/tags/tags.state';
import { ValueType } from '../../share/models/value-models/value-type.model';
import { PowerConfigStateModel, PowerConfigsHistorian, PowerConfigsRealtime } from '../../core/stores/configs/powermeter/power-config.model';
import { DateTimeService } from '../../share/services/datetime.service';

@Injectable({
    providedIn: 'root'
})
export class PowerRequestService {

    constructor(private store: Store,
    private dateTimeService: DateTimeService) { }

    createRequest(dashboardConfigs: PowerConfigStateModel[]): PowerRequestStateModel[] {
        // const dashboardConfigs: DashboardConfigStateModel[] = this.store.selectSnapshot(DashboardConfigsState);
        const requests = this.genRequest(dashboardConfigs);
        return requests;
    }

    createRealtimeRequest(configs: PowerConfigsRealtime[]): PowerReqRealtime {
        let requests: PowerReqRealtime = {
        Tags: []
        }
        configs.forEach((item)=>{
        //console.log(item);
        requests.Tags.push(item.Name);
        });
        //console.log(requests);
        return requests;
    }

    createHistorianRequest(configs: PowerConfigsHistorian[]): PowerReqHistorian[] {
        let requests: PowerReqHistorian[] = []
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

    private genRequest(dashboardConfigs: PowerConfigStateModel[]): PowerRequestStateModel[] {
        const currReq: PowerRequestStateModel = this.getCurrentConfig(dashboardConfigs);
        const atTimeReq: PowerRequestStateModel[] = this.getAtTimeConfig(dashboardConfigs);
        const requests: PowerRequestStateModel[] = [currReq, ...atTimeReq];
        return requests;
    }

    private getCurrentConfig(dashboardConfigs: PowerConfigStateModel[]): PowerRequestStateModel {
        // const currConfigs = dashboardConfigs.filter(c => c.type === ValueType.RealTime);
        // const uuid = UUID.UUID();
        // const id = uuid;
        // const type = ValueType.RealTime;
        // const tagNames = currConfigs.map(c => c.tagName);
        // const tags: TagsStateModel[] = this.store.selectSnapshot(TagsState.getTagIds(tagNames));
        // const tagIds = tags.map(x => x.Id) || [];

        // const req: PowerRequestStateModel = {
        //     RequestId: id,
        //     Mode: type,
        //     ItemIds: tagIds,
        // };
        return null;
    }

    private getAtTimeConfig(dashboardConfigs: PowerConfigStateModel[]): PowerRequestStateModel[] {
        // const atTimeConfigs = dashboardConfigs.filter(c => c.type === ValueType.AtTime);
        // const requests: PowerRequestStateModel[] = [];
        // atTimeConfigs.forEach(config => {
        //     const uuid = UUID.UUID();
        //     const id = uuid;
        //     const type = ValueType.AtTime;
        //     const tag: TagsStateModel = this.store.selectSnapshot(TagsState.getTagId(config.tagName));
        //     console.log(tag)
        //     const StartTime = this.dateTimeService.getToday();
        //     if (tag) {
        //         const req: PowerRequestStateModel = {
        //             RequestId: config.name,
        //             Mode: type,
        //             ItemIds: [tag.Id],
        //             StartTime: StartTime
        //         };
        //         requests.push(req);
        //     }
    
        // });

        return null;
    }

}
