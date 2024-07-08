import { Action,createSelector,State,StateContext } from "@ngxs/store";
import produce from "immer";
import { HttpService } from "src/app/share/services/http.service";
import { BuildingModel, SiteStateModel } from "./sites.model";

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
      return state.building;
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

  static getAllZone(){
    return createSelector([SitesState], (state: SiteStateModel) => {
      let res: SiteStateModel[] = [];
      console.log(state)
      state.building.filter(x => x.building.length > 0).forEach(i => {
        let item: SiteStateModel = {
          project: i.name,
          capacity: i.capacity,
          number: parseInt(i.no),
          building: i.building.map(function(bx){
            let building: BuildingModel = state.building.find(x => x.id == bx);
            if(building){
              return building;
            } else {
              return undefined;
            }
          })
        }
        res.push(item)
      })
      return res;
    })
  }
  
}