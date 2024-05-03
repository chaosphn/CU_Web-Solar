import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { UUID } from 'angular2-uuid';
import { DiagramRequestStateModel } from '../../core/stores/requests/diagram/diagram-request.model';
import { TagsStateModel } from '../../core/stores/tags/tags.model';
import { TagsState } from '../../core/stores/tags/tags.state';
import { ValueType } from '../../share/models/value-models/value-type.model';
import { DiagramConfigStateModel } from './../../core/stores/configs/diagram/diagram-config.model';
import { DateTimeService } from './../../share/services/datetime.service';

@Injectable({
    providedIn: 'root'
})
export class DiagramRequestService {

    constructor(private store: Store,
    private dateTimeService: DateTimeService) { }

    createRequest(dashboardConfigs: DiagramConfigStateModel[]): DiagramRequestStateModel[] {
        // const dashboardConfigs: DashboardConfigStateModel[] = this.store.selectSnapshot(DashboardConfigsState);
        const requests = this.genRequest(dashboardConfigs);
        return requests;
    }

    private genRequest(dashboardConfigs: DiagramConfigStateModel[]): DiagramRequestStateModel[] {
        const currReq: DiagramRequestStateModel = this.getCurrentConfig(dashboardConfigs);
        const atTimeReq: DiagramRequestStateModel[] = this.getAtTimeConfig(dashboardConfigs);
        const requests: DiagramRequestStateModel[] = [currReq, ...atTimeReq];
        return requests;
    }

    private getCurrentConfig(dashboardConfigs: DiagramConfigStateModel[]): DiagramRequestStateModel {
        const currConfigs = dashboardConfigs.filter(c => c.type === ValueType.RealTime);
        const uuid = UUID.UUID();
        const id = uuid;
        const type = ValueType.RealTime;
        const tagNames = currConfigs.map(c => c.tagName);
        const tags: TagsStateModel[] = this.store.selectSnapshot(TagsState.getTagIds(tagNames));
        const tagIds = tags.map(x => x.Id) || [];

        const req: DiagramRequestStateModel = {
            RequestId: id,
            Mode: type,
            ItemIds: tagIds,
        };
        return req;
    }

    private getAtTimeConfig(dashboardConfigs: DiagramConfigStateModel[]): DiagramRequestStateModel[] {
        const atTimeConfigs = dashboardConfigs.filter(c => c.type === ValueType.AtTime);
        const requests: DiagramRequestStateModel[] = [];
        atTimeConfigs.forEach(config => {
            const uuid = UUID.UUID();
            const id = uuid;
            const type = ValueType.AtTime;
            const tag: TagsStateModel = this.store.selectSnapshot(TagsState.getTagId(config.tagName));
            const StartTime = this.dateTimeService.getToday();
            if (tag) {
                const req: DiagramRequestStateModel = {
                    RequestId: config.name,
                    Mode: type,
                    ItemIds: [tag.Id],
                    StartTime: StartTime
                };
                requests.push(req);
            }
    
        });

        return requests;
    }

}
