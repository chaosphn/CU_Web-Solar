import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { ServersStateModel } from '../../core/stores/servers/servers.model';
import { ValueType } from '../../share/models/value-models/value-type.model';
import { ServersState } from '../../core/stores/servers/servers.state';

@Injectable({
    providedIn: 'root'
})
export class DashboardTagService {

    constructor(private store: Store) { }

    addServerName(configs: any[]) {
        const server: ServersStateModel = this.store.selectSnapshot(ServersState);
        configs.forEach(config => {
            this.addServerNameToConfig(config, server.serverSelected);
        });
    }

    private addServerNameToConfig(config: any, serverName: string) {
        if (config.type) {
            const type: ValueType = config.type;
            switch (type) {
                case ValueType.RealTime:
                    config.tagName = serverName + config.tagName;
                    break;
                case ValueType.AtTime:
                    config.tagName = serverName + config.tagName;
                    break;
                case ValueType.Plot:
                    this.addServerNameToTags(config, serverName);
                    break;
                case ValueType.Raw:
                    this.addServerNameToTags(config, serverName);
                    break;
            }
        }
    }

    
    private addServerNameToTags(config: any, serverName: string) {
        if (config.tags) {
            config.tags.forEach(tag => {
                tag.name = serverName + tag.name;
            });
        }
    }

    getTagNames(configs: any[]) {
        const tagNames: string[] = [];
        configs.forEach(config => {
            const tags = this.extractConfigTypes(config);
            tagNames.push(...tags);
        });
        const uniqueTagNames = Array.from(new Set(tagNames));
        return uniqueTagNames;
    }

    private extractConfigTypes(config: any): string[] {
        if (config.type) {
            const type: ValueType = config.type;
            switch (type) {
                case ValueType.RealTime:
                    return [config.tagName];
                case ValueType.AtTime:
                    return [config.tagName];
                case ValueType.Plot:
                    return this.getTagsFromPlotValue(config);
                case ValueType.Raw:
                    return this.getTagsFromRawValue(config);
            }
        }
    }

    private getTagsFromPlotValue(config: any) {
        const tagNames: string[] = [];
        if (config && config.tags && config.tags.length > 0) {
            const tags = config.tags.map(x => x.name);
            tagNames.push(...tags);
        }
        return tagNames;
    }

    private getTagsFromRawValue(config: any) {
        const tagNames: string[] = [];
        if (config && config.tags && config.tags.length > 0) {
            const tags = config.tags.map(x => x.name);
            tagNames.push(...tags);
        }
        return tagNames;
    }

}

