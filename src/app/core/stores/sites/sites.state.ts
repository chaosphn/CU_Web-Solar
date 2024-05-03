import { Action,createSelector,State,StateContext } from "@ngxs/store";
import produce from "immer";
import { HttpService } from "src/app/share/services/http.service";
import { SiteStateModel } from "./sites.model";

export class AddSite {
    static readonly type = '[Sites] AddSite';
    constructor(public payload: SiteStateModel) {}
}

@State<SiteStateModel>({
  name: 'sites',
  defaults: {
    project: "",
    capacity: 0,
    number: 0,
    building: []
  }
})
export class SitesState {
  @Action(AddSite)
  addSite(ctx: StateContext<SiteStateModel>, action: AddSite) {
    
    ctx.setState(action.payload);
    //console.log(ctx.getState());
  }

  static getSites() {
    return createSelector([SitesState], (state: SiteStateModel) => {
      return state
    });
  }

  static getSiteWithName(name: string){
    return createSelector([SitesState], (state: SiteStateModel) => {
      const res = state.building.find( x => x.name == name);
      return res;
    })
  }

  static getSiteWithId(id: string){
    return createSelector([SitesState], (state: SiteStateModel) => {
      const res = state.building.find( x => x.id == id);
      return res;
    })
  }
  
}