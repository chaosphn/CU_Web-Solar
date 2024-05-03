import { Options } from "../../configs/dashboard/dashboard-configs.model";

export interface PowerRequestStateModel {
    RequestId: string;
    Mode: string;
    ItemIds: number[];
    StartTime?: string;
    EndTime?: string;
}

export interface PowerReqRealtime{
    Tags: string[];
}

export interface PowerReqHistorian{
    Name: string;
    Options: Options; 
}

export interface PowerRequestModel{
    Realtime: PowerReqRealtime;
    Historian: PowerReqHistorian[];
}

// export interface DiagramRequestStateModel {
//     Id: string;
//     Items: Items;
// }
