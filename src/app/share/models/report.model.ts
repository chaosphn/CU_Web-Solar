import { ReportHeaderModel } from "src/app/reports/reports.component";

export interface ReportModel {
    [name: string]: ReportData;
}

export interface ReportData {
    tagName: string;
    value: string;
    quality: number | string;
    timestamp: string | Date;
    name: string;
}

export interface ReportFactorModel{
    ExchangeRate: number;
    OnPeakRate: number;
    OffPeakRate: number;
    FT:number;
    CO2Rate: number;
    OilRate: number;
    TreeRate: number;
    TimeStamp: string;
}

export interface HolidayResponseModel{
    Name: string;
    Type: string;
    StartDate: string;
    EndDate: string;
}

export interface SetHolidayModel{
    Name: string;
    Type: string;
    StartDate: Date;
    EndDate: Date;
}

export interface HolidayRequestModel{
    StartDate: string;
    EndDate: string;
}

export interface ReportRequestModel{
    Name: string,
    StartTime: string,
    EndTime: string,
    Type: string,
    Header: ReportHeaderModel[],
    DateColumn: Date[]
}