import { Action, createSelector, State, StateContext, Store } from '@ngxs/store';
import { ValueType } from '../../../../share/models/value-models/value-type.model';
import { PowerRequestModel, PowerRequestStateModel } from './power-request.model';
import { produce } from 'immer';

export class SetPowerRequest {
    static readonly type = '[PowerRequestState] SetPowerRequest';
    constructor(public payload: PowerRequestModel) { }
}

export class AddPowerRequest {
    static readonly type = '[PowerConfigsState] AddPowerConfigs';
    constructor(public config: PowerRequestModel) { }
}

@State<PowerRequestModel>({
    name: 'powerRequest',
    defaults: {
        Realtime: {
            Tags: []
        },
        Historian: []
    }
})
export class PowerRequestState {
    
    constructor(private store: Store) { }

    @Action(SetPowerRequest)
    setPowerRequest(ctx: StateContext<PowerRequestModel>, action: SetPowerRequest) {
        ctx.setState(action.payload);
        //console.log(ctx.getState());
    }

    @Action(AddPowerRequest)
    AddPowerRequest(ctx: StateContext<PowerRequestModel>, action: PowerRequestModel) {
        const state = ctx.getState();
        const newState = produce(state, draft => {
            if(draft.Realtime = null){
                draft.Realtime = action.Realtime;
            }
            if(draft.Historian.length < 1){
                draft.Historian = [...action.Historian];
            }
        });
        ctx.setState(newState);
    }

    static getRequest() {  
        return createSelector([PowerRequestState], (state: PowerRequestModel) => {
            return state;
        });
    }

    static getRequestRealtime() {  
        return createSelector([PowerRequestState], (state: PowerRequestModel) => {
            return state.Realtime;
        });
    }

    static getRequestHistorian() {  
        return createSelector([PowerRequestState], (state: PowerRequestModel) => {
            return state.Historian;
        });
    }

    static getRealTimeCurrentConfig() {
        return createSelector([PowerRequestState], (state: PowerRequestStateModel[]) => {
            const _configs: PowerRequestStateModel[] = [];
            state.forEach(s => {
                if (s.Mode === ValueType.RealTime || s.Mode === ValueType.AtTime) {
                    _configs.push(s);
                }
            });
            return _configs;
        });
    }
}

