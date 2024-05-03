export interface Grouping {
    groupName: string;
    path?: string;
    groups?: string[];
    alias?: string[];
}

export interface TagGrouping {
    Category: string;
    Groups: Group[];
    Aliases: AliasItem[];
}

export interface Group {
    Name: string;
    FullPath: string;
    active: boolean;
    Display?: string;
}

export interface AliasItem {
    Name: string;
    active: boolean;
    Display?: string;
}


export interface TagMerge {
    groups: Group[];
    alias: AliasItem[];
}

export interface TagInfo{
    TagID: number;
    Name: string;
    Address: string;
    PointSource: string;
    Group: string;
    Unit: string;
}