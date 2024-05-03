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
