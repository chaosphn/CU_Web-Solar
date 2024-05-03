import { Options } from "../../configs/dashboard/dashboard-configs.model";

export interface InverterRequestStateModel {
    RequestId: string;
    Mode: string;
    ItemIds: number[];
    StartTime?: string;
    EndTime?: string;
}

export interface InverterReqRealtime{
    Tags: string[];
}

export interface InverterReqHistorian{
    Name: string;
    Options: Options; 
}

export interface InverterRequestModel{
    Realtime: InverterReqRealtime;
    Historian: InverterReqHistorian[];
}

// export interface DiagramRequestStateModel {
//     Id: string;
//     Items: Items;
// }
