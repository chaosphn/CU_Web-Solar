export interface InverterConfigStateModel {
    realtimeConfig: InverterConfigsRealtime[];
    historianConfig: InverterConfigsHistorian[];
}

  
export interface InverterConfigsRealtime{
    Name: string;
    Title: string;
}

export interface InverterConfigsHistorian{
    Name: string;
    Mode: string;
    Options: Options; 
}

export interface Options{
    Time: string;
    StartTime: string;
    EndTime: string;
}