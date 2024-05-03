export interface DashboardLastValuesStateModel {
    RequestId: string;
    DataSets?: ItemParameters[];
    Success?: boolean;
    Message?: string;
}

export interface ItemParameters {
    Records?: DataRecords[];
    ItemId: number;
    ItemName: string;
}

export interface DataRecords {
    Quality?: number | string;
    Timestamp?: string;
    Value?: string;
}


export interface WriteDataRequest {
    DataSets: DataSet[];    
}

export interface DataSet {
    ItemName?: string;
    ItemId?: number;
    Records: DataRecords[];    
}
export interface DashboardLastValuesModel{
    Name: string;
    Mode: string;
    Unit: string;
    Min:string;
    Max: string;
    DataRecord: Record[];
}

export interface DashboardResRealtime{
    Name: string;
    Unit: string;
    Value: string;
    Min: string;
    Max: string;
    TimeStamp: string;
}

export interface DashboardResHistorian{
    Name: string;
    Unit: string;
    Min: string;
    Max: string;
    records?: Record[];
}

export interface Record{
    TimeStamp?:string;
    Value?:string;
}