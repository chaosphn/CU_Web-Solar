export interface OverviewConfigStateModel {
    name: string;
    title: string;
    type: string;
    tagName?: string;
    tags?: PlotTag[] | RawTag[] | InverterTag[];
    options?: TagOptions;
    interval?: number;
    
}

export interface Test{
    config: any;
}

export interface PlotTag {
    name: string;
    title: string;
    options?: HisOptions;
}

export interface InverterTag {
    name: string;
    title: string;
    options?: HisOptions;
}

export interface RawTag {
    name: string;
    type: string;
    title: string;
    period: string;
    options?: HisOptions;
}

export interface HisOptions {
    chartOptions: PlotChartOptions;
}

export interface PlotChartOptions {
    yAxis?: number;
    type?: string;
    color?: string;
}

export interface TagOptions {
    chartOptions?: TagChartOptions;
    runtimeConfigs?: PeriodConfig;
    timestamp?: string; 
}

export interface TagChartOptions {
    yAxis?: YAxis[];
    xAxis?: XAxis;
}

export interface YAxis {
    color?: string;
    text?: string;
    opposite?: boolean;
    useMax?: boolean;
    visible?: boolean;
}

export interface XAxis {
    categories: string[];
}

export interface PeriodConfig {
    periodName: string;
    zoom?: boolean;
    min?: number | string;
    max?: number | string;
}
