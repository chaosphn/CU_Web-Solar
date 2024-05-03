import { DataRecords, ItemParameters } from '../dashboard/dashboard-last-values.model';

export interface InverterLastValuesStateModel {
    RequestId: string;
    DataSets?: ItemParameters[];
    Success?: boolean;
    Message?: string;
}


export interface InverterLastValuesStateModel1 {
    Id: string;
    Items: Items[];
}


export interface Items {
    Records?: DataRecords[];
    Id: number;
    Name: string;
}

export interface InverterLastValuesModel{
    Name: string;
    Mode: string;
    Unit: string;
    Min: string;
    Max: string;
    DataRecord: Record[];
}

export interface InverterResRealtime{
    Name: string;
    Unit: string;
    Value: string;
    Min: string;
    Max: string;
    TimeStamp: string;
}

export interface InverterResHistorian{
    Name: string;
    Unit: string;
    Min: string;
    Max: string;
    records?: Record[];
}

export interface Record{
    TimeStamp:string;
    Value:string;
}