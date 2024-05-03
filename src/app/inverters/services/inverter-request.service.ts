import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { UUID } from 'angular2-uuid';
import { InverterRequestStateModel, InverterReqRealtime, InverterReqHistorian } from '../../core/stores/requests/inverter/inverter-request.model';
import { TagsStateModel } from '../../core/stores/tags/tags.model';
import { TagsState } from '../../core/stores/tags/tags.state';
import { ValueType } from '../../share/models/value-models/value-type.model';
import { InverterConfigStateModel, InverterConfigsRealtime, InverterConfigsHistorian } from '../../core/stores/configs/inverter/inverter-config.model';
import { DateTimeService } from '../../share/services/datetime.service';

@Injectable({
    providedIn: 'root'
})
export class InverterRequestService {

    constructor(private store: Store,
    private dateTimeService: DateTimeService) { }

    createRequest(dashboardConfigs: InverterConfigStateModel[]): InverterRequestStateModel[] {
        // const dashboardConfigs: DashboardConfigStateModel[] = this.store.selectSnapshot(DashboardConfigsState);
        const requests = this.genRequest(dashboardConfigs);
        return requests;
    }

    createRealtimeRequest(configs: InverterConfigsRealtime[]): InverterReqRealtime {
        let requests: InverterReqRealtime = {
        Tags: []
        }
        configs.forEach((item)=>{
        //console.log(item);
        requests.Tags.push(item.Name);
        });
        //console.log(requests);
        return requests;
    }

    createHistorianRequest(configs: InverterConfigsHistorian[]): InverterReqHistorian[] {
        let requests: InverterReqHistorian[] = []
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

    private genRequest(dashboardConfigs: InverterConfigStateModel[]): InverterRequestStateModel[] {
        const currReq: InverterRequestStateModel = this.getCurrentConfig(dashboardConfigs);
        const atTimeReq: InverterRequestStateModel[] = this.getAtTimeConfig(dashboardConfigs);
        const requests: InverterRequestStateModel[] = [currReq, ...atTimeReq];
        return requests;
    }

    private getCurrentConfig(dashboardConfigs: InverterConfigStateModel[]): InverterRequestStateModel {
        // const currConfigs = dashboardConfigs.filter(c => c.type === ValueType.RealTime);
        // const uuid = UUID.UUID();
        // const id = uuid;
        // const type = ValueType.RealTime;
        // const tagNames = currConfigs.map(c => c.tagName);
        // const tags: TagsStateModel[] = this.store.selectSnapshot(TagsState.getTagIds(tagNames));
        // const tagIds = tags.map(x => x.Id) || [];

        // const req: InverterRequestStateModel = {
        //     RequestId: id,
        //     Mode: type,
        //     ItemIds: tagIds,
        // };
        return null;
    }

    private getAtTimeConfig(dashboardConfigs: InverterConfigStateModel[]): InverterRequestStateModel[] {
        // const atTimeConfigs = dashboardConfigs.filter(c => c.type === ValueType.AtTime);
        // const requests: InverterRequestStateModel[] = [];
        // atTimeConfigs.forEach(config => {
        //     const uuid = UUID.UUID();
        //     const id = uuid;
        //     const type = ValueType.AtTime;
        //     const tag: TagsStateModel = this.store.selectSnapshot(TagsState.getTagId(config.tagName));
        //     console.log(tag)
        //     const StartTime = this.dateTimeService.getToday();
        //     if (tag) {
        //         const req: InverterRequestStateModel = {
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
