export interface OverviewLastValuesStateModel {
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
