import { Action, createSelector, State, StateContext, Store } from '@ngxs/store';
import { ValueType } from '../../../../share/models/value-models/value-type.model';
import { InverterRequestModel, InverterRequestStateModel } from './inverter-request.model';
import { produce } from 'immer';

export class SetInverterRequest {
    static readonly type = '[InverterRequestState] SetInverterRequest';
    constructor(public payload: InverterRequestModel) { }
}

export class AddInverterRequest {
    static readonly type = '[InverterConfigsState] AddInverterConfigs';
    constructor(public config: InverterRequestModel) { }
}

@State<InverterRequestModel>({
    name: 'InverterRequest',
    defaults: {
        Realtime: {
            Tags: []
        },
        Historian: []
    }
})
export class InverterRequestState {
    
    constructor(private store: Store) { }

    @Action(SetInverterRequest)
    setInverterRequest(ctx: StateContext<InverterRequestModel>, action: SetInverterRequest) {
        ctx.setState(action.payload);
        //console.log(ctx.getState());
    }

    @Action(AddInverterRequest)
    AddInverterRequest(ctx: StateContext<InverterRequestModel>, action: InverterRequestModel) {
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
        return createSelector([InverterRequestState], (state: InverterRequestModel) => {
            return state;
        });
    }

    static getRequestRealtime() {  
        return createSelector([InverterRequestState], (state: InverterRequestModel) => {
            return state.Realtime;
        });
    }

    static getRequestHistorian() {  
        return createSelector([InverterRequestState], (state: InverterRequestModel) => {
            return state.Historian;
        });
    }

    static getRealTimeCurrentConfig() {
        return createSelector([InverterRequestState], (state: InverterRequestStateModel[]) => {
            const _configs: InverterRequestStateModel[] = [];
            state.forEach(s => {
                if (s.Mode === ValueType.RealTime || s.Mode === ValueType.AtTime) {
                    _configs.push(s);
                }
            });
            return _configs;
        });
    }
}

