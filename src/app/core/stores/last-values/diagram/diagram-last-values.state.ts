import { Action, createSelector, State, StateContext } from '@ngxs/store';
import produce from 'immer';
import { ItemParameters } from '../dashboard/dashboard-last-values.model';
import { DiagramLastValuesModel, DiagramLastValuesStateModel, DiagramResRealtime } from './diagram-last-values.model';


export class SetDiagramValues {
    static readonly type = '[DiagramLastValues] SetDiagramValues';
    constructor(public payload: DiagramLastValuesModel[]) { }
}

export class ChangeDiagramLastValues {
    static readonly type = '[DiagramLastValuesState] ChangeDiagramLastValues';
    constructor(public name: string, public items: DiagramResRealtime[]) { }
}

@State<DiagramLastValuesStateModel[]>({
    name: 'diagramLastValues',
    defaults: []
})
export class DiagramLastValuesState {
    @Action(SetDiagramValues)
    setDiagramValues(ctx: StateContext<DiagramLastValuesModel[]>, action: SetDiagramValues) {
        ctx.setState(action.payload);
        //console.log(ctx.getState());
    }

    @Action(ChangeDiagramLastValues)
    changeDiagramLastValues(ctx: StateContext<DiagramLastValuesModel[]>, action: ChangeDiagramLastValues) {
        const state = ctx.getState();
        const newState = produce(state, draft => {
            const lastValues = draft.find(d => d.Name != null);
            //lastValues.DataRecord = ;
        });
        ctx.setState(newState);
    }


    static getLastValues(id: string) {
        return createSelector([DiagramLastValuesState], (state: DiagramLastValuesStateModel[]) => {
            return state.filter(s => s.RequestId === id);
        });
    }

    static getLastValues1() {
        return createSelector([DiagramLastValuesState], (state: DiagramLastValuesModel[]) => {
            return state;
        });
    }

    static getLastValuesWithName(name: string) {
        return createSelector([DiagramLastValuesState], (state: DiagramLastValuesModel[]) => {
            return state.filter(x => x.Name == name);
        });
    }
}

