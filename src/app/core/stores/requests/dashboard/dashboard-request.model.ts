import { Options } from "../../configs/dashboard/dashboard-configs.model";

export interface DashboardRequestStateModel {
    RequestId: string;
    Mode: string;
    ItemIds: number[];
    StartTime?: string;
    EndTime?: string;
    Interval?: number;
    Timestamp?: string;
}

export interface DashboardReqRealtime{
    Tags: string[];
}

export interface DashboardReqHistorian{
    Name: string;
    Options: Options; 
}

export interface DashboardRequestModel{
    Realtime: DashboardReqRealtime;
    Historian: DashboardReqHistorian[];
}