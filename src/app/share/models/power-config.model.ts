export interface PowerConfig {
    Name: string;
    TagName: string;
    Format: string;
    Type: string;
}

export interface PowerConfigModel {
    Name: string;
    Title: string;
}

export interface PowerTagConfig{
    PointSource: string;
    DataType: string;
    Scan: string;
    Alarm: string;
    Group: string;
}