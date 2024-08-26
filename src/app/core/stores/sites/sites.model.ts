export interface SiteStateModel{
    project: string;
    capacity: number;
    number: number;
    name?: string;
    building: BuildingModel[];
}

export interface BuildingModel{
    no: string,
    id: string;
    zone: string;
    name: string;
    capacity: number;
    display?: boolean;
    building?: string[];
}

