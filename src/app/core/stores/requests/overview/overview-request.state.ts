import { Action, createSelector, State, StateContext, Store } from '@ngxs/store';
import { produce } from 'immer';
import { TagsStateModel } from '../../tags/tags.model';
import { TagsState } from '../../tags/tags.state';
import { ValueType } from './../../../../share/models/value-models/value-type.model';
import { OverviewConfigStateModel, RawTag } from './../../configs/overview/overview-configs.model';
import { OverviewConfigsState } from './../../configs/overview/overview-configs.state';
import { OverviewRequestStateModel } from './overview-request.model';

export class SetOverviewRequest {
    static readonly type = '[OverviewRequest] SetOverviewRequest';
    constructor(public payload: OverviewRequestStateModel[]) { }
}

export class ChangePeriod {
    static readonly type = '[OverviewRequest] ChangePeriod';
    constructor(public requestName: string, public startTime: string, public endTime: string) { }
}


export class ChangeTagIds {
    static readonly type = '[OverviewRequest] ChangeTagIds';
    constructor(public groupId: string, public periodName: string) { }
}

@State<OverviewRequestStateModel[]>({
    name: 'overviewRequest',
    defaults: []
})
export class OverviewRequestState {
    
    constructor(private store: Store) { }

    @Action(SetOverviewRequest)
    setOverviewRequest(ctx: StateContext<OverviewRequestStateModel[]>, action: SetOverviewRequest) {
        ctx.setState(action.payload);
    }

    @Action(ChangePeriod)
    ChangePeriod(ctx: StateContext<OverviewRequestStateModel[]>, action: ChangePeriod) {
        const state = ctx.getState();
        const newState = produce(state, draft => {
            const request = draft.find(d => d.RequestId === action.requestName);
            if (request) {
                request.StartTime = action.startTime;
                request.EndTime = action.endTime;
            }
        });
        ctx.setState(newState);
    }

    @Action(ChangeTagIds)
    ChangeTagIds(ctx: StateContext<OverviewRequestStateModel[]>, action: ChangeTagIds) {
        const dbConfig: OverviewConfigStateModel[] = this.store.selectSnapshot(OverviewConfigsState);
        const group = dbConfig.find(c => c.name === action.groupId);
        if (group && group.type === ValueType.Raw) {
            const raw: RawTag[] = group.tags as RawTag[];
            const tags = raw.filter(r => r.period === action.periodName);
            const state = ctx.getState();
            const newState =  produce(state, draft => {
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
 
    static getRequest(type: ValueType) {  
        return createSelector([OverviewRequestState], (state: OverviewRequestStateModel[]) => {
            return state.filter(s => s.Mode === type);
        });
    }
    
    static getRequestWithId(id: string) {  
        return createSelector([OverviewRequestState], (state: OverviewRequestStateModel[]) => {
            return state.filter(s => s.RequestId === id);
        });
    }

    
    static getRealTimeCurrentConfig() {
        return createSelector([OverviewRequestState], (state: OverviewRequestStateModel[]) => {
            const _configs: OverviewRequestStateModel[] = [];
            state.forEach(s => {
                if (s.Mode === ValueType.RealTime || s.Mode === ValueType.AtTime) {
                    _configs.push(s);
                }
            });
            return _configs;
        });
    }

    static getRealTimeHistoriesConfig() {
        return createSelector([OverviewRequestState, OverviewConfigsState], (state: OverviewRequestStateModel[], overviewConfigs: OverviewConfigStateModel[]) => {
            const _configs: OverviewRequestStateModel[] = [];
            state.forEach(s => {
                if (s.Mode === ValueType.Raw || s.Mode === ValueType.Plot) {
                    const req = overviewConfigs.find(x => x.name === s.RequestId);
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

