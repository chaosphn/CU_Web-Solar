import { Action,createSelector,State,StateContext } from "@ngxs/store";
import produce from "immer";
import { HttpService } from "src/app/share/services/http.service";
import { BuildingModel } from "../sites/sites.model";


export class SetBulding {
    static readonly type = '[Building] SetBulding';
    constructor(public payload: BuildingModel) {}
}

@State<BuildingModel>({
  name: 'building',
  defaults: {
    no:"",
    id: "",
    zone: "",
    name: "",
    capacity: 0
  }
})
export class BuildingState {
  @Action(SetBulding)
  addSite(ctx: StateContext<BuildingModel>, action: SetBulding) {
    
    ctx.setState(action.payload);
    //console.log(ctx.getState());
  }

  static getSites() {
    return createSelector([BuildingState], (state: BuildingModel) => {
      return state
    });
  }
  
}