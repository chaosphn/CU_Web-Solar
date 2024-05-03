import { Action, createSelector, State, StateContext } from '@ngxs/store';
import { produce } from 'immer';
import { OverviewLastValuesStateModel, ItemParameters } from './overview-last-values.model';


export class SetOverviewValues {
    static readonly type = '[OverviewLastValues] SetOverviewValues';
    constructor(public payload: OverviewLastValuesStateModel[]) { }
}

export class ChangeLastValues {
    static readonly type = '[OverviewLastValues] ChangeLastValues';
    constructor(public name: string, public items: ItemParameters[]) { }
}

export class AddValues {
    static readonly type = '[OverviewLastValues] AddValues';
    constructor(public name: string, public values: OverviewLastValuesStateModel) { }
}

export class ChangeValues {
    static readonly type = '[OverviewLastValues] ChangeValues';
    constructor(public name: string, public values: OverviewLastValuesStateModel) { }
}

@State<OverviewLastValuesStateModel[]>({
    name: 'overviewLastValues',
    defaults: []
})
export class OverviewLastValuesState {
    @Action(SetOverviewValues)
    setOverviewValues(ctx: StateContext<OverviewLastValuesStateModel[]>, action: SetOverviewValues) {
        // bug here !!!
        const state = ctx.getState();
        action.payload = action.payload.filter(x => x.DataSets && x.DataSets.length > 0);
        const requestIds = action.payload.map(x => x.RequestId);
        const newState = state.filter(x => requestIds.indexOf(x.RequestId) === -1);
        ctx.setState([...newState, ...action.payload]);

        // const newState = produce(state, draft => {
        //     const hasValues = action.payload.filter(x => x.DataSets.length > 0);
        //     hasValues.forEach(x => {
        //         const request = draft.find(d => d.RequestId === x.RequestId);
        //         if (request) {
        //             request.DataSets = x.DataSets;
        //             request.Success = x.Success;
        //             request.Message = x.Message;
        //         }
        //     });
 
        // });
        // ctx.setState(newState);
        // ctx.setState([...state, ...action.payload]);

    }

    @Action(ChangeLastValues)
    changeLastValues(ctx: StateContext<OverviewLastValuesStateModel[]>, action: ChangeLastValues) {
        const state = ctx.getState();
        const newState = produce(state, draft => {
            const lastValues = draft.find(d => d.RequestId === action.name);
            if (lastValues) {
                lastValues.DataSets = action.items;
            }
 
        });
        ctx.setState(newState);
    }

    @Action(AddValues)
    addValues(ctx: StateContext<OverviewLastValuesStateModel[]>, action: AddValues) {
        const state = ctx.getState();
        const newState = produce(state, draft => {
            const groups = draft.find(d => d.RequestId === action.values.RequestId);
            action.values.DataSets.forEach(item => {
                const _item = groups.DataSets.find(g => g.ItemId === item.ItemId);
                if (_item) {
                    _item.Records.push(...item.Records);
                }

            });

        });
        ctx.setState(newState);
    }

    @Action(ChangeValues)
    changeValues(ctx: StateContext<OverviewLastValuesStateModel[]>, action: ChangeValues) {
        const state = ctx.getState();
        const newState = produce(state, draft => {
            const groups = draft.find(d => d.RequestId === action.values.RequestId);
            action.values.DataSets.forEach(item => {
                const _item = groups.DataSets.find(g => g.ItemId === item.ItemId);
                if (_item) {
                    _item.Records = item.Records;
                }

            });

        });
        ctx.setState(newState);
    }

    static getLastValues(id: string) {
        return createSelector([OverviewLastValuesState], (state: OverviewLastValuesStateModel[]) => {
            return state.filter(s => s.RequestId === id);
        });
    }

}

