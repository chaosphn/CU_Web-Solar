import { Action, createSelector, State, StateContext } from '@ngxs/store';
import { ValueType } from '../../../../share/models/value-models/value-type.model';
import { PowerConfigStateModel } from './power-config.model';
import { produce } from 'immer';

export class SetPowerConfigs {
    static readonly type = '[PowerConfigsState] SetPowerConfigs';
    constructor(public payload: PowerConfigStateModel) { }
}

export class AddPowerConfigs {
    static readonly type = '[PowerConfigsState] AddPowerConfigs';
    constructor(public config: PowerConfigStateModel) { }
}

@State<PowerConfigStateModel[]>({
    name: 'powerConfigs',
    defaults: []
})

export class PowerConfigsState {
    @Action(SetPowerConfigs)
    setDiagramConfigs(ctx: StateContext<PowerConfigStateModel>, action: SetPowerConfigs) {
        ctx.setState(action.payload); 
        //console.log(ctx.getState())      
    }

    @Action(AddPowerConfigs)
    AddConfigName(ctx: StateContext<PowerConfigStateModel>, action: AddPowerConfigs) {
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

    static getPowerConfigs(type: ValueType) {  
        return createSelector([PowerConfigsState], (state: PowerConfigStateModel) => {
            return state;
        });
    }

    static getRealtimeConfigs() {  
        return createSelector([PowerConfigsState], (state: PowerConfigStateModel) => {
            return state.realtimeConfig;
        });
    }

    static getHistorianConfigs() {  
        return createSelector([PowerConfigsState], (state: PowerConfigStateModel) => {
            return state.historianConfig;
        });
    }
      
    static getConfigs(type: ValueType) {  
        return createSelector([PowerConfigsState], (state: PowerConfigStateModel[]) => {
            return state;
        });
    }
}

