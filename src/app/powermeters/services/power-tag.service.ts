import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { PowerConfig } from 'src/app/share/models/power-config.model';
import { ServersStateModel } from '../../core/stores/servers/servers.model';
import { ServersState } from '../../core/stores/servers/servers.state';
import { ValueType } from '../../share/models/value-models/value-type.model';

@Injectable({
    providedIn: 'root'
})
export class PowerTagService {

    constructor(private store: Store) { }

    addServerName(configs: PowerConfig[]) {
        const server: ServersStateModel = this.store.selectSnapshot(ServersState);
        configs.forEach(config => {
            this.addServerNameToConfig(config, server.serverSelected);
        });
    }

    private addServerNameToConfig(config: PowerConfig, serverName: string) {
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
    
    getTagNames(configs: PowerConfig[]) {
        const tagNames: string[] = [];
        configs.forEach(config => {
            const tags = this.extractConfigTypes(config);
            tagNames.push(...tags);
        });
        const uniqueTagNames = Array.from(new Set(tagNames));
        return uniqueTagNames;
    }

    private extractConfigTypes(config: PowerConfig): string[] {
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
