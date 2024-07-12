import { Action, createSelector, State, StateContext, Store } from '@ngxs/store';
import { produce } from 'immer';
import { TagsStateModel } from '../../tags/tags.model';
import { TagsState } from '../../tags/tags.state';
import { ValueType } from './../../../../share/models/value-models/value-type.model';
import { DashboardConfigStateModel, RawTag } from './../../configs/dashboard/dashboard-configs.model';
import { DashboardConfigsState } from './../../configs/dashboard/dashboard-configs.state';
import { DashboardRequestStateModel, DashboardRequestModel, DashboardReqRealtime, DashboardReqHistorian } from './dashboard-request.model';
import { store } from '@angular/core/src/render3/instructions';
import { s } from '@angular/core/src/render3';

export class SetDashboardRequest {
    static readonly type = '[DashboardRequest] SetDashboardRequest';
    constructor(public payload: DashboardRequestModel) { }
}

export class ChangePeriod {
    static readonly type = '[DashboardRequest] ChangePeriod';
    constructor(public requestName: string, public startTime: string, public endTime: string) { }
}

export class ChangePeriod1 {
    static readonly type = '[DashboardRequest] ChangePeriod1';
    constructor(public requestName: any[], public startTime: string, public endTime: string, public period: string) { }
}

export class ChangePeriod2 {
    static readonly type = '[DashboardRequest] ChangePeriod2';
    constructor(public requestName: any[], public startTime: string, public endTime: string, public period: string) { }
}

export class ChangeTagIds {
    static readonly type = '[DashboardRequest] ChangeTagIds';
    constructor(public groupId: string, public periodName: string) { }
}

@State<DashboardRequestModel>({
    name: 'dashboardRequest',
    defaults: {
        Realtime: {
            Tags: []
        },
        Historian: []
    }
})
export class DashboardRequestState {

    constructor(private store: Store) { }

    @Action(SetDashboardRequest)
    setDashboardRequest(ctx: StateContext<DashboardRequestModel>, action: SetDashboardRequest) {
        ctx.setState(action.payload);
        //console.log(ctx.getState());
    }

    @Action(ChangePeriod)
    ChangePeriod(ctx: StateContext<DashboardRequestModel>, action: ChangePeriod) {
        const state = ctx.getState();
        const newState = produce(state, draft => {
            const request = draft.Historian.find(d => d.Name != null);
            if (request.Options.StartTime != null && request.Options.EndTime != null) {
                request.Options.StartTime = action.startTime;
                request.Options.EndTime = action.endTime;
            }
        });
        ctx.setState(newState);
    }

    @Action(ChangePeriod1)
    ChangePeriod1(ctx: StateContext<DashboardRequestModel>, action: ChangePeriod1) {
        let state = ctx.getState();
        
        const startTimeISO = new Date(action.startTime).toISOString().split('.')[0];
        const endTimeISO = new Date(action.endTime).toISOString().split('.')[0];
        const changeItem = action.requestName[0].find(x => x.period == action.period);
        //console.log(changeItem)
        // action.requestName[0].forEach((item) => {
        //     const itemName = item.name.split('_')[0];
        //     state.Historian.forEach((req) => {
        //         const reqName = req.Name.split('_')[0];

        //         if (reqName == itemName) {
        //             let request1 = req;
        //             if(changeItem && changeItem.name){
        //                 request1.Name = changeItem.name;
        //             }
        //             if (request1 && request1.Options.StartTime && request1.Options.EndTime) {
        //                 request1.Options.StartTime = startTimeISO;
        //                 request1.Options.EndTime = endTimeISO;

        //                 if (request1.Options.Time !="") {
        //                     request1.Options.Time = "";
        //                 }
        //             }
        //             console.log(request1)
        //         }
        //     });
        // });
        state.Historian.forEach((req) => {
            let reqName = req.Name;
            //console.log(action.requestName[0])
            let itemName = action.requestName[0].find(x => x.name == req.Name);
            //console.log(reqName);
            //console.log(itemName)
            if ( itemName && itemName.name && reqName == itemName.name) {
                let request1 = req;
                if(changeItem && changeItem.name){
                    //console.log(changeItem)
                    request1.Name = changeItem.name;
                }
                if (request1 && request1.Options.StartTime && request1.Options.EndTime) {
                    request1.Options.StartTime = startTimeISO;
                    request1.Options.EndTime = endTimeISO;

                    if (request1.Options.Time !="") {
                        request1.Options.Time = "";
                    }
                }
                //console.log(request1)
            }
        });
        //console.log(state)
        ctx.setState(state);
    }

    @Action(ChangePeriod2)
    ChangePeriod2(ctx: StateContext<DashboardRequestModel>, action: ChangePeriod2) {
        let state = ctx.getState();
        
        const startTimeISO = new Date(action.startTime).toISOString().split('.')[0];
        const endTimeISO = new Date(action.endTime).toISOString().split('.')[0];
        const changeItem = action.requestName[0].find(x => x.period == action.period);
        state.Historian.forEach((req) => {
            let reqName = req.Name;
            //console.log(action.requestName[0])
            let itemName = action.requestName[0].find(x => x.name == req.Name);
            //console.log(reqName);
            //console.log(itemName)
            if ( itemName && itemName.name && reqName == itemName.name) {
                let request1 = req;
                if(changeItem && changeItem.name){
                    //console.log(changeItem)
                    request1.Name = changeItem.name;
                }
                if (request1 && request1.Options.StartTime && request1.Options.EndTime) {
                    request1.Options.StartTime = startTimeISO;
                    request1.Options.EndTime = endTimeISO;

                    if (request1.Options.Time !="") {
                        request1.Options.Time = "";
                    }
                }
                //console.log(request1)
            }
        });
        //console.log(state)
        ctx.setState(state);
    }


    @Action(ChangeTagIds)
    ChangeTagIds(ctx: StateContext<DashboardRequestStateModel[]>, action: ChangeTagIds) {
        const dbConfig: DashboardConfigStateModel[] = this.store.selectSnapshot(DashboardConfigsState);
        const group = dbConfig.find(c => c.name === action.groupId);
        if (group && group.type === ValueType.Raw) {
            const raw: RawTag[] = group.tags as RawTag[];
            const tags = raw.filter(r => r.period === action.periodName);
            const state = ctx.getState();
            const newState = produce(state, draft => {
                const groupReq = draft.find(d => d.RequestId === action.groupId);
                if (groupReq) {
                    const tagNames = tags.map(t => t.name);
                    const _tags: TagsStateModel[] = this.store.selectSnapshot(TagsState.getTagIds(tagNames));
                    groupReq.ItemIds = _tags.map(t => t.Id);
                }
            });
            ctx.setState(newState);
        }
    }

    static getRequest() {
        return createSelector([DashboardRequestState], (state: DashboardRequestModel) => {
            return state;
        });
    }

    static getRequestRealtime() {
        return createSelector([DashboardRequestState], (state: DashboardRequestModel) => {
            return state.Realtime;
        });
    }

    static getRequestHistorian() {
        return createSelector([DashboardRequestState], (state: DashboardRequestModel) => {
            return state.Historian;
        });
    }

    static getRequestHistorianWithName(chartName: any[],period) {
        return createSelector([DashboardRequestState], (state: DashboardRequestModel) => {
            const stateHis = state.Historian;
            let reqHis: DashboardReqHistorian[] = [];
            chartName[0].filter(x => x.period == period.Type || !x.period).forEach((item) => {
                let request = stateHis.find(d => d.Name == item.name);
                if(request){
                    reqHis.push(request);
                }
                
            });
            return reqHis;
        });
    }

    static getRequestWithKeys(key: string) {
        return createSelector([DashboardRequestState], (state: DashboardRequestModel) => {
            //console.log(state[key]);
            return state[key];
        });
    }

    static getRequestWithId(id: string) {
        return createSelector([DashboardRequestState], (state: DashboardRequestStateModel[]) => {
            return state.filter(s => s.RequestId === id);
        });
    }


    static getRealTimeCurrentConfig() {
        return createSelector([DashboardRequestState], (state: DashboardRequestStateModel[]) => {
            const _configs: DashboardRequestStateModel[] = [];
            state.forEach(s => {
                if (s.Mode === ValueType.RealTime || s.Mode === ValueType.AtTime) {
                    _configs.push(s);
                }
            });
            return _configs;
        });
    }

    static getRealTimeHistoriesConfig() {
        return createSelector([DashboardRequestState, DashboardConfigsState], (state: DashboardRequestStateModel[], dashboardConfigs: DashboardConfigStateModel[]) => {
            const _configs: DashboardRequestStateModel[] = [];
            state.forEach(s => {
                if (s.Mode === ValueType.Raw || s.Mode === ValueType.Plot) {
                    const req = dashboardConfigs.find(x => x.name === s.RequestId);
                    if (req &&
                        req.options &&
                        req.options.runtimeConfigs &&
                        req.options.runtimeConfigs.periodName &&
                        req.options.runtimeConfigs.periodName.toLowerCase() === 't' &&
                        req.options.runtimeConfigs.zoom === false) {
                        _configs.push(s);
                    }
                }
            });
            return _configs;
        });
    }
}

