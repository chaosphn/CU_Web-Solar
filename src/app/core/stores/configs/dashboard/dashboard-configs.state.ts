import { Action, createSelector, State, StateContext } from '@ngxs/store';
import { produce } from 'immer';
import { ValueType } from './../../../../share/models/value-models/value-type.model';
import { DashboardConfigs, DashboardConfigStateModel } from './dashboard-configs.model';
import { state } from '@angular/animations';
import { DashboardReqHistorian } from '../../requests/dashboard/dashboard-request.model';

export class SetDashboardConfigs {
    static readonly type = '[DashboardConfigsState] SetDashboardConfigs';
    constructor(public payload: DashboardConfigs) { }
}

export class ChangePeriodName {
    static readonly type = '[DashboardConfigsState] ChangePeriodName';
    constructor(public periodName: string, public configName: string) { }
}

export class SetZoom {
    static readonly type = '[DashboardConfigsState] SetZoom';
    constructor(public chartName: string, public min: number, public  max: number) { }
}

export class ResetZoom {
    static readonly type = '[DashboardConfigsState] ResetZoom';
    constructor(public chartName: string) { }
}


@State<DashboardConfigStateModel[]>({
    name: 'dashboardConfigs',
    defaults: []
})

export class DashboardConfigsState {

    @Action(SetDashboardConfigs)
    setDashboardConfigs(ctx: StateContext<DashboardConfigs>, action: SetDashboardConfigs) {
        ctx.setState(action.payload);
        //console.log(ctx.getState());       
    }

    @Action(ChangePeriodName)
    changePeriodName(ctx: StateContext<DashboardConfigs>, action: ChangePeriodName) {
        const state = ctx.getState();
        const newState = produce(state, draft => {
            const config = draft.chartConfig.find(d => d.name === action.configName);
            if (config && config.options && config.options.runtimeConfigs) {
                config.options.runtimeConfigs.periodName = action.periodName;
            }
        });
        ctx.setState(newState);
    }

    
    @Action(SetZoom)
    setZoom(ctx: StateContext<DashboardConfigs>, action: SetZoom) {
     const state = ctx.getState();
     const newState = produce(state, draft => {
         /*const config = draft.find(d => d.name === action.chartName);
         if (config && config.options && config.options.runtimeConfigs) {
            config.options.runtimeConfigs.zoom = true;
            config.options.runtimeConfigs.min = action.min;
            config.options.runtimeConfigs.max = action.max;
        }*/
     });
     ctx.setState(newState);
    }

    @Action(ResetZoom)
    resetZoom(ctx: StateContext<DashboardConfigs>, action: ResetZoom) { 
        const state = ctx.getState();
        const newState = produce(state, draft => {
            /*const config = draft.find(d => d.name === action.chartName);
            if (config && config.options && config.options.runtimeConfigs) {
               config.options.runtimeConfigs.zoom = false;
           }*/
        });
        ctx.setState(newState);
       }
    
    static getRealtimeConfigs() {  
        return createSelector([DashboardConfigsState], (state: DashboardConfigs) => {
            return state.realtimeConfig;
        });
    }

    static getHistorianConfigs() {  
        return createSelector([DashboardConfigsState], (state: DashboardConfigs) => {
            return state.historianConfig;
        });
    }

    static getChartsConfigs() {  
        return createSelector([DashboardConfigsState], (state: DashboardConfigs) => {
            return state.chartConfig;
        });
    }

    static getConfigsWithNameReal(name: string) {  
        return createSelector([DashboardConfigsState], (state: DashboardConfigs) => {
            return state.realtimeConfig.find(s => s.Name == name);
        });
    }

    static getConfigsWithNameHis(name: string) {  
        return createSelector([DashboardConfigsState], (state: DashboardConfigs) => {
            return state.historianConfig.find(s => s.Name == name);
        });
    }

    static getConfigwithChartName(name: string) {
        return createSelector(
          [DashboardConfigsState],
          (state: { chartConfig: DashboardConfigStateModel[] }) => {
            const reqTags = state.chartConfig
              .filter(item => item.name === name)
              .map(item => (item.tags || []).filter(val => val.name != null));
      
            //console.log(reqTags);
            return reqTags;
          }
        );
    }
      
}

