import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { DiagramConfig } from 'src/app/share/models/diagram-config.model';
import { ServersStateModel } from '../../../../core/stores/servers/servers.model';
import { ServersState } from '../../../../core/stores/servers/servers.state';
import { ValueType } from '../../../models/value-models/value-type.model';

@Injectable({
    providedIn: 'root'
})
export class DigramTagService {

    constructor(private store: Store) { }

    addServerName(configs: DiagramConfig[]) {
        const server: ServersStateModel = this.store.selectSnapshot(ServersState);
        configs.forEach(config => {
            this.addServerNameToConfig(config, server.serverSelected);
        });
    }

    private addServerNameToConfig(config: DiagramConfig, serverName: string) {
        if (config.Type) {
            const type: ValueType = config.Type as ValueType;
            switch (type) {
                case ValueType.RealTime:
                    config.TagName = serverName + config.TagName;
                    break;
                case ValueType.AtTime:
                    config.TagName = serverName + config.TagName;
                    break;
            }
        }
    }
    
    getTagNames(configs: DiagramConfig[]) {
        const tagNames: string[] = [];
        configs.forEach(config => {
            const tags = this.extractConfigTypes(config);
            tagNames.push(...tags);
        });
        const uniqueTagNames = Array.from(new Set(tagNames));
        return uniqueTagNames;
    }

    private extractConfigTypes(config: DiagramConfig): string[] {
        if (config.Type) {
            const type: ValueType = config.Type as ValueType;
            switch (type) {
                case ValueType.RealTime:
                    return [config.TagName];
                case ValueType.AtTime:
                    return [config.TagName];
            }
        }
    }
}
