import { Action, createSelector, State, StateContext } from '@ngxs/store';
import produce from 'immer';
import { HttpService } from '../../../share/services/http.service';
import { TagsStateModel } from './tags.model';

export class AddTags {
    static readonly type = '[Tags] AddTags';
    constructor(public payload: string[]) { }
}


@State<TagsStateModel[]>({
    name: 'tags',
    defaults: []
})

export class TagsState {

    constructor(private httpService: HttpService) { }

    @Action(AddTags)
    async AddTags(ctx: StateContext<TagsStateModel[]>, action: AddTags) {
        const state = ctx.getState();
        const tagRegistered = state.map(x => x.Name);
        const tagsNotRegister = action.payload.filter(t => tagRegistered.indexOf(t) === -1);
        if (tagsNotRegister.length > 0) {
            //const tags = await this.httpService.registerTags(tagsNotRegister);
            const newState = produce(state, draft => {
                draft.push();
            });
            ctx.setState(newState);
        }
    }

    static getTagIds(tagNames: string[]) {  
        return createSelector([TagsState], (state: TagsStateModel[]) => {
            return state.filter(s => tagNames.indexOf(s.Name) !== -1);
        });
    }

    static getTagId(tagName: string) {  
        return createSelector([TagsState], (state: TagsStateModel[]) => {
            return state.find(s => tagName === s.Name);
        });
    }
}

