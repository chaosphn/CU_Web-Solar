import { Action, createSelector, State, StateContext } from '@ngxs/store';
import produce from 'immer';
import { ItemParameters } from '../dashboard/dashboard-last-values.model';
import { PowerLastValuesModel, PowerLastValuesStateModel } from './power-last-values.model';


export class SetPowerValues {
    static readonly type = '[PowerLastValues] SetPowerValues';
    constructor(public payload: PowerLastValuesModel[]) { }
}

export class AddValues {
    static readonly type = '[PowerLastValues] AddValues';
    constructor( public values: PowerLastValuesModel[] ) { }
}

export class ChangePowerLastValues {
    static readonly type = '[PowerLastValuesState] ChangePowerLastValues';
    constructor(public name: string, public items: ItemParameters[]) { }
}

@State<PowerLastValuesModel[]>({
    name: 'PowerLastValues',
    defaults: []
})
export class PowerLastValuesState {
    @Action(SetPowerValues)
    setDiagramValues(ctx: StateContext<PowerLastValuesModel[]>, action: SetPowerValues) {
        ctx.setState(action.payload);
        //console.log(ctx.getState());
    }

    @Action(AddValues)
    addValues(ctx: StateContext<PowerLastValuesModel[]>, action: AddValues) {
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


    @Action(ChangePowerLastValues)
    changeDiagramLastValues(ctx: StateContext<PowerLastValuesStateModel[]>, action: ChangePowerLastValues) {
        const state = ctx.getState();
        const newState = produce(state, draft => {
            const lastValues = draft.find(d => d.RequestId === action.name);
            lastValues.DataSets = action.items;
        });
        ctx.setState(newState);
    }


    static getLastValues(id: string) {
        return createSelector([PowerLastValuesState], (state: PowerLastValuesStateModel[]) => {
            return state;
        });
    }

    static getLastValuesRealtime(tag: string) {
        return createSelector([PowerLastValuesState], (state: PowerLastValuesModel[]) => {
            return state.filter(s => s.Name == tag && s.Mode === 'Realtime');
        });
    }

    static getLastValuesHistorian(tag: string) {
        return createSelector([PowerLastValuesState], (state: PowerLastValuesModel[]) => {
            return state.filter(s => s.Name == tag && s.Mode === 'Historian');
        });
    }


}

