import { Action, State, StateContext } from '@ngxs/store';
import { UserStateModel } from './user.model';

export class SetUser {
    static readonly type = '[User] SetUser';
    constructor(public user: UserStateModel) { }
}

@State<UserStateModel>({
    name: 'user',
    defaults: null
})
export class UserState {
    constructor() { }

    @Action(SetUser)
    async setUser(ctx: StateContext<UserStateModel>, action: SetUser) {
        ctx.setState(action.user);
    }
}
