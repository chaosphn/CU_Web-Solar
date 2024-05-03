import { Action, createSelector, State, StateContext, Store } from '@ngxs/store';
import { ValueType } from '../../../../share/models/value-models/value-type.model';
import { DiagramReqModel, DiagramRequestStateModel } from './diagram-request.model';


export class SetDiagramRequest {
    static readonly type = '[DiagramRequestState] SetDiagramRequest';
    constructor(public payload: DiagramReqModel) { }
}

@State<DiagramReqModel>({
    name: 'diagramRequest',
    defaults: {
        Tags: []
    }
})
export class DiagramRequestState {
    
    constructor(private store: Store) { }

    @Action(SetDiagramRequest)
    setDiagramRequest(ctx: StateContext<DiagramReqModel>, action: SetDiagramRequest) {
        ctx.setState(action.payload);
    }


    static getRequest() {  
        return createSelector([DiagramRequestState], (state: DiagramReqModel) => {
            return state;
        });
    }

    static getRealTimeCurrentConfig() {
        return createSelector([DiagramRequestState], (state: DiagramRequestStateModel[]) => {
            const _configs: DiagramRequestStateModel[] = [];
            state.forEach(s => {
                if (s.Mode === ValueType.RealTime || s.Mode === ValueType.AtTime) {
                    _configs.push(s);
                }
            });
            return _configs;
        });
    }
}

