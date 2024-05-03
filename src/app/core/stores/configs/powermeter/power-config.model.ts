export interface PowerConfigStateModel {
    realtimeConfig: PowerConfigsRealtime[];
    historianConfig: PowerConfigsHistorian[];
}

  
export interface PowerConfigsRealtime{
    Name: string;
    Title: string;
}

export interface PowerConfigsHistorian{
    Name: string;
    Mode: string;
    Options: Options; 
}

export interface Options{
    Time: string;
    StartTime: string;
    EndTime: string;
}