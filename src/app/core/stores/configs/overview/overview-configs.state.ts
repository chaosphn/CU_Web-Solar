import { Action, createSelector, State, StateContext } from '@ngxs/store';
import { produce } from 'immer';
import { ValueType } from './../../../../share/models/value-models/value-type.model';
import { OverviewConfigStateModel } from './overview-configs.model';

export class SetOverviewConfigs {
    static readonly type = '[OverviewConfigsState] SetOverviewConfigs';
    constructor(public payload: OverviewConfigStateModel[]) { }
}

export class ChangePeriodName {
    static readonly type = '[OverviewConfigsState] ChangePeriodName';
    constructor(public periodName: string, public configName: string) { }
}

export class SetZoom {
    static readonly type = '[OverviewConfigsState] SetZoom';
    constructor(public chartName: string, public min: number, public  max: number) { }
}

export class ResetZoom {
    static readonly type = '[OverviewConfigsState] ResetZoom';
    constructor(public chartName: string) { }
}

@State<OverviewConfigStateModel[]>({
    name: 'overviewConfigs',
    defaults: []
})

export class OverviewConfigsState {

    @Action(SetOverviewConfigs)
    setOverviewConfigs(ctx: StateContext<OverviewConfigStateModel[]>, action: SetOverviewConfigs) {
        ctx.setState(action.payload);       
    }

    @Action(ChangePeriodName)
    changePeriodName(ctx: StateContext<OverviewConfigStateModel[]>, action: ChangePeriodName) {
        const state = ctx.getState();
        const newState = produce(state, draft => {
            const config = draft.find(d => d.name === action.configName);
            if (config && config.options && config.options.runtimeConfigs) {
                config.options.runtimeConfigs.periodName = action.periodName;
            }
        });
        ctx.setState(newState);
    }

    
    @Action(SetZoom)
    setZoom(ctx: StateContext<OverviewConfigStateModel[]>, action: SetZoom) {
     const state = ctx.getState();
     const newState = produce(state, draft => {
         const config = draft.find(d => d.name === action.chartName);
         if (config && config.options && config.options.runtimeConfigs) {
            config.options.runtimeConfigs.zoom = true;
            config.options.runtimeConfigs.min = action.min;
            config.options.runtimeConfigs.max = action.max;
        }
     });
     ctx.setState(newState);
    }

    @Action(ResetZoom)
    resetZoom(ctx: StateContext<OverviewConfigStateModel[]>, action: ResetZoom) { 
        const state = ctx.getState();
        const newState = produce(state, draft => {
            const config = draft.find(d => d.name === action.chartName);
            if (config && config.options && config.options.runtimeConfigs) {
               config.options.runtimeConfigs.zoom = false;
           }
        });
        ctx.setState(newState);
       }
    
    static getConfigs(type: ValueType) {  
        return createSelector([OverviewConfigsState], (state: OverviewConfigStateModel[]) => {
            return state.filter(s => s.type === type);
        });
    }

    static getConfigsWithName(name: string) {  
        return createSelector([OverviewConfigsState], (state: OverviewConfigStateModel[]) => {
            return state.find(s => s.name === name);
        });
    }
}

