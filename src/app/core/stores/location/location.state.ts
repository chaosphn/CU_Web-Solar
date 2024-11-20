import { Action,createSelector,State,StateContext } from "@ngxs/store";
import produce from "immer";
import { HttpService } from "src/app/share/services/http.service";
import { BuildingModel, LocationStateModel, SiteStateModel } from "./location.model";

export class AddZone {
    static readonly type = '[Location] AddZone';
    constructor(public payload: LocationStateModel) {}
}

@State<LocationStateModel>({
  name: 'location',
  defaults: {
    zone: "",
    meters: [
        // { "id": "xxxxxxxx", "name": "North East" },
        // { "id": "xxxxxxxx", "name": "North West" },
        // { "id": "xxxxxxxx", "name": "South East" },
        // { "id": "xxxxxxxx", "name": "South West" }
    ],
    buildings: [
        // {
        //     "id":"ARC003",
        //     "name":"อาคารเลิศ อุรัสยะนันทน์"
        // },
        // {
        //     "id":"PSC012",
        //     "name":"อาคาร 50 ปี สาธิตจุฬาลงกรณ์มหาวิทยาลัย"
        // },
        // {
        //     "id":"CEN099",
        //     "name":"อาคารจอดรถ 1"
        // },
        // {
        //     "id":"CEN087",
        //     "name":"อาคารเฉลิมราชสุดากีฬาสถาน"
        // },
        // {
        //     "id":"CEN001",
        //     "name":"อาคารจามจุรี1"
        // },
        // {
        //     "id":"CEN003",
        //     "name":"โรงอาหารสำนักงานมหาวิทยาลัย"
        // },
        // {
        //     "id":"CEN005",
        //     "name":"อาคารสำนักงานจัดการทรัพย์สิน"
        // },
        // {
        //     "id":"CEN072",
        //     "name":"หอพักพุดซ้อน"
        // },
        // {
        //     "id":"CEN091",
        //     "name":"หอพักชวนชม"
        // },
        // {
        //     "id":"DEN014",
        //     "name":"อาคารพรีคลินิก"
        // },
        // {
        //     "id":"PHA003",
        //     "name":"โรงพักสัตว์ทดลอง"
        // },
        // {
        //     "id":"PHA007",
        //     "name":"ศูนย์ปฏิบัติการวิจัยและพัฒนาเภสัชภัณฑ์และสมุนไพร"
        // },
        // {
        //     "id":"INS012",
        //     "name":"อาคารสถาบัน3"
        // },
        // {
        //     "id":"SCI020",
        //     "name":"อาคารแถบ นีละนิธิ"
        // },
        // {
        //     "id":"SCI025",
        //     "name":"อาคารมหามกุฎ"
        // },
        // {
        //     "id":"SCI028",
        //     "name":"อาคารมหาวชิรุณหิศ"
        // },
        // {
        //     "id":"CEN060",
        //     "name":"อาคารจุลจักรพงษ์"
        // },
        // {
        //     "id":"INS009",
        //     "name":"อาคารประชาธิปก-รำไพพรรณี"
        // },
        // {
        //     "id":"CEN068",
        //     "name":"อาคารมหิตลาธิเบศร"
        // },
        // {
        //     "id":"CEN093",
        //     "name":"อาคารจอดรถ3"
        // },
        // {
        //     "id":"ECO001",
        //     "name":"อาคารเศรษฐศาสตร์"
        // },
        // {
        //     "id":"CEN032",
        //     "name":"อาคารเปรมบุรฉัตร"
        // },
        // {
        //     "id":"ENG028",
        //     "name":"อาคารเจริญวิศวกรรม"
        // },
        // {
        //     "id":"ENG030",
        //     "name":"อาคารปฏิบัติการวิศวกรรมโยธาและสิ่งแวดล้อม"
        // },
        // {
        //     "id":"ART005",
        //     "name":"อาคารมหาจักรีสิรินธร"
        // },
        // {
        //     "id":"CEN053",
        //     "name":"อาคารบรมราชกุมารี"
        // },
        // {
        //     "id":"CEN079",
        //     "name":"อาคารจอดรถ 2"
        // },
        // {
        //     "id":"INS011",
        //     "name":"อาคารวิทยาลัยปิโตรเลียมและปิโตรเคมี"
        // },
        // {
        //     "id":"CEN100",
        //     "name":"อาคารจุฬาพัฒน์14"
        // },
        // {
        //     "id":"CEN089",
        //     "name":"จุฬานิวาส"
        // },
        // {
        //     "id":"CEN069",
        //     "name":"อาคารจุฬาวิชช์ 1"
        // },
        // {
        //     "id":"CEN078",
        //     "name":"อาคารบรมราชชนนีศรีศตพรรษ"
        // },
        // {
        //     "id":"CEN006",
        //     "name":"สนามกีฬาจุฬาลงกรณ์มหาวิทยาลัย"
        // },
        // {
        //     "id":"EDU011",
        //     "name":"อาคารพระมิ่งขวัญการศึกษาไทย"
        // },
        // {
        //     "id":"LAW003",
        //     "name":"อาคารเทพทวาราวดี"
        // },
        // {
        //     "id":"CEN103",
        //     "name":"บัณฑิตวิทยาลัย"
        // },
        // {
        //     "id":"INS010",
        //     "name":"อาคารศศปาฐศาลา"
        // },
        // {
        //     "id":"DEN002",
        //     "name":"อาคารทันตรักษ์วิจัย"
        // },
        // {
        //     "id":"PHA001",
        //     "name":"อาคารเภสัชศาสตร์"
        // },
        // {
        //     "id":"PHA006",
        //     "name":"สถานปฏิบัติการเภสัชกรรมชุมชน(โอสถศาลา)"
        // },
        // {
        //     "id":"ESC008",
        //     "name":"อาคารอเนกประสงค์"
        // }
    ]
  }
})
export class LocationState {
  @Action(AddZone)
  addSite(ctx: StateContext<LocationStateModel>, action: AddZone) {
    
    ctx.setState(action.payload);
    //console.log(ctx.getState());
  }

  static getLocation() {
    return createSelector([LocationState], (state: LocationStateModel) => {
      return state;
    });
  }

  static getSiteWithName(name: string){
    return createSelector([LocationState], (state: LocationStateModel) => {
      // const res = state.building.find( x => x.name == name);
      // return res;
    })
  }

  static getSiteWithId(id: string){
    return createSelector([LocationState], (state: LocationStateModel) => {
      // const res = state.building.find( x => x.id == id);
      // return res;
    })
  }

  static getAllZone(){
    return createSelector([LocationState], (state: LocationStateModel) => {
      // let res: SiteStateModel[] = [];
      // console.log(state)
      // state.building.filter(x => x.building.length > 0).forEach(i => {
      //   let item: SiteStateModel = {
      //     project: i.name,
      //     capacity: i.capacity,
      //     number: parseInt(i.no),
      //     building: i.building.map(function(bx){
      //       let building: BuildingModel = state.building.find(x => x.id == bx);
      //       if(building){
      //         return building;
      //       } else {
      //         return undefined;
      //       }
      //     })
      //   }
      //   res.push(item)
      // })
      // return res;
    })
  }
  
}