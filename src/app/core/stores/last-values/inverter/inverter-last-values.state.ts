import { Action, createSelector, State, StateContext } from '@ngxs/store';
import produce from 'immer';
import { ItemParameters } from '../dashboard/dashboard-last-values.model';
import { InverterLastValuesModel, InverterLastValuesStateModel } from './inverter-last-values.model';


export class SetInverterValues {
    static readonly type = '[InverterLastValues] SetInverterValues';
    constructor(public payload: InverterLastValuesModel[]) { }
}

export class AddValues {
    static readonly type = '[InverterLastValues] AddValues';
    constructor( public values: InverterLastValuesModel[] ) { }
}

export class ChangeInverterLastValues {
    static readonly type = '[InverterLastValuesState] ChangeInverterLastValues';
    constructor(public name: string, public items: ItemParameters[]) { }
}

@State<InverterLastValuesModel[]>({
    name: 'InverterLastValues',
    defaults: []
})
export class InverterLastValuesState {
    @Action(SetInverterValues)
    setDiagramValues(ctx: StateContext<InverterLastValuesModel[]>, action: SetInverterValues) {
        ctx.setState(action.payload);
        //console.log(ctx.getState());
    }

    @Action(AddValues)
    addValues(ctx: StateContext<InverterLastValuesModel[]>, action: AddValues) {
        const state = ctx.getState();
        const newState = produce(state, draft => {
            action.values.forEach(item => {
                const _item = draft;
                _item.push(item);
            });

        });
        ctx.setState(newState);
        //console.log(newState);
    }


    @Action(ChangeInverterLastValues)
    changeDiagramLastValues(ctx: StateContext<InverterLastValuesStateModel[]>, action: ChangeInverterLastValues) {
        const state = ctx.getState();
        const newState = produce(state, draft => {
            const lastValues = draft.find(d => d.RequestId === action.name);
            lastValues.DataSets = action.items;
        });
        ctx.setState(newState);
    }


    static getLastValues(id: string) {
        return createSelector([InverterLastValuesState], (state: InverterLastValuesStateModel[]) => {
            return state;
        });
    }

    static getLastValuesRealtime(tag: string) {
        return createSelector([InverterLastValuesState], (state: InverterLastValuesModel[]) => {
            return state.filter(s => s.Name == tag && s.Mode === 'Realtime');
        });
    }

    static getLastValuesHistorian(tag: string) {
        return createSelector([InverterLastValuesState], (state: InverterLastValuesModel[]) => {
            return state.filter(s => s.Name == tag && s.Mode === 'Historian');
        });
    }


}


