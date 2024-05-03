export interface DataRead {
    RequestId: string;
    Mode: string;
    ItemIds: number[];
    StartTime?: string;
    EndTime?: string;
    Interval?: number;
}
