import { Action, State, StateContext } from '@ngxs/store';
import { ServersStateModel } from './servers.model';

export class SetServer {
    static readonly type = '[Servers] SetServer';
    constructor(public payload: ServersStateModel) { }
}

@State<ServersStateModel>({
    name: 'servers',
    defaults: null
})

export class ServersState {

    @Action(SetServer)
    SetServer(ctx: StateContext<ServersStateModel>, action: SetServer) {
        ctx.setState(action.payload);
    }
}

