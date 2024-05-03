import { DataRecords, ItemParameters } from '../dashboard/dashboard-last-values.model';

export interface DiagramLastValuesStateModel {
    RequestId: string;
    DataSets?: ItemParameters[];
    Success?: boolean;
    Message?: string;
}


export interface DiagramLastValuesStateModel1 {
    Id: string;
    Items: Items[];
}


export interface Items {
    Records?: DataRecords[];
    Id: number;
    Name: string;
}

export interface DiagramLastValuesModel{
    Name: string;
    Mode: string;
    Unit: string;
    Min: string;
    Max: string;
    DataRecord: Record[];
}

export interface DiagramResRealtime{
    Name: string;
    Unit: string;
    Value: string;
    Min: string;
    Max: string;
    TimeStamp: string;
}

export interface DiagramResHistorian{
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