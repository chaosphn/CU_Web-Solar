import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { InverterConfig } from 'src/app/share/models/inverter-config.model';
import { ServersStateModel } from '../../core/stores/servers/servers.model';
import { ServersState } from '../../core/stores/servers/servers.state';
import { ValueType } from '../../share/models/value-models/value-type.model';

@Injectable({
    providedIn: 'root'
})
export class InverterTagService {

    constructor(private store: Store) { }

    addServerName(configs: InverterConfig[]) {
        const server: ServersStateModel = this.store.selectSnapshot(ServersState);
        configs.forEach(config => {
            this.addServerNameToConfig(config, server.serverSelected);
        });
    }

    private addServerNameToConfig(config: InverterConfig, serverName: string) {
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
    
    getTagNames(configs: InverterConfig[]) {
        const tagNames: string[] = [];
        configs.forEach(config => {
            const tags = this.extractConfigTypes(config);
            tagNames.push(...tags);
        });
        const uniqueTagNames = Array.from(new Set(tagNames));
        return uniqueTagNames;
    }

    private extractConfigTypes(config: InverterConfig): string[] {
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
