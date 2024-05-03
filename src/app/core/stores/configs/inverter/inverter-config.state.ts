import { Action, createSelector, State, StateContext } from '@ngxs/store';
import { ValueType } from '../../../../share/models/value-models/value-type.model';
import { InverterConfigStateModel } from './inverter-config.model';
import { produce } from 'immer';

export class SetInverterConfigs {
    static readonly type = '[InverterConfigsState] SetInverterConfigs';
    constructor(public payload: InverterConfigStateModel) { }
}

export class AddInverterConfigs {
    static readonly type = '[InverterConfigsState] AddInverterConfigs';
    constructor(public config: InverterConfigStateModel) { }
}

@State<InverterConfigStateModel[]>({
    name: 'InverterConfigs',
    defaults: []
})

export class InverterConfigsState {
    @Action(SetInverterConfigs)
    setDiagramConfigs(ctx: StateContext<InverterConfigStateModel>, action: SetInverterConfigs) {
        ctx.setState(action.payload); 
        //console.log(ctx.getState())      
    }

    @Action(AddInverterConfigs)
    AddConfigName(ctx: StateContext<InverterConfigStateModel>, action: AddInverterConfigs) {
        const state = ctx.getState();
        const newState = produce(state, draft => {
            if(draft.realtimeConfig.length < 1){
                draft.realtimeConfig = [...action.config.realtimeConfig]
            }
            if(draft.historianConfig.length < 1){
                draft.historianConfig = [...action.config.historianConfig]
            }
        });
        ctx.setState(newState);
    }

    static getInverterConfigs(type: ValueType) {  
        return createSelector([InverterConfigsState], (state: InverterConfigStateModel) => {
            return state;
        });
    }

    static getRealtimeConfigs() {  
        return createSelector([InverterConfigsState], (state: InverterConfigStateModel) => {
            return state.realtimeConfig;
        });
    }

    static getHistorianConfigs() {  
        return createSelector([InverterConfigsState], (state: InverterConfigStateModel) => {
            return state.historianConfig;
        });
    }
      
    static getConfigs(type: ValueType) {  
        return createSelector([InverterConfigsState], (state: InverterConfigStateModel[]) => {
            return state;
        });
    }
}


