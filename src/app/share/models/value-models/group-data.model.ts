import { DataRecords } from '../../../core/stores/last-values/dashboard/dashboard-last-values.model';

export interface GroupData {
    singleValue?: SingleValue;
    multipleValue?: MultipleValue;
}

export interface GroupData1 {
    singleValue?: SingleValue1;
    multipleValue?: MultipleValue;
}

export interface Data {
    dataRecords: DataRecords[];
    maxValue: string;
    minValue: string;
    tagNames?: string[];
    title?: string;
    name?: string;
    unit?: string;
    options?: any;
}


export interface SingleValue {
    [name: string]: Data;
}

export interface SingleValue1 {
    [name: string]: Data;
}

export interface Data1{
    dataRecords: Record[];
    tagNames: string;
    unit: string
}


export interface Record{
    TimeStamp:string;
    Value:string;
}

export interface MultipleValue {
    [name: string]: MultipleData;

}


export interface MultipleData {
    data?: Data[];
    options?: any;
}
