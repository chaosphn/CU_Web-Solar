import { Action, createSelector, State, StateContext } from '@ngxs/store';
import { ValueType } from '../../../../share/models/value-models/value-type.model';
import { DiagramConfigStateModel } from './diagram-config.model';
import { DiagramConfigModel } from 'src/app/share/models/diagram-config.model';

export class SetDiagramConfigs {
    static readonly type = '[DiagramConfigsState] SetDiagramConfigs';
    constructor(public payload: DiagramConfigModel[]) { }
}

@State<DiagramConfigStateModel[]>({
    name: 'diagramConfigs',
    defaults: []
})

export class DiagramConfigsState {
    @Action(SetDiagramConfigs)
    setDiagramConfigs(ctx: StateContext<DiagramConfigModel[]>, action: SetDiagramConfigs) {
        ctx.setState(action.payload);       
    }

      
    static getConfigs(type: ValueType) {  
        return createSelector([DiagramConfigsState], (state: DiagramConfigModel[]) => {
            return state;
        });
    }

    static getConfigs1() {  
        return createSelector([DiagramConfigsState], (state: DiagramConfigModel[]) => {
            return state;
        });
    }
}

