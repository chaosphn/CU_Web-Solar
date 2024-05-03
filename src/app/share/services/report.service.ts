import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { UUID } from 'angular2-uuid';
import { ServersStateModel } from '../../core/stores/servers/servers.model';
import { ServersState } from '../../core/stores/servers/servers.state';
import { DataRead } from '../models/data-read.model';
import { ValueType } from './../models/value-models/value-type.model';


@Injectable({
    providedIn: 'root'
})
export class ReportService {

    constructor(private store: Store) { }

    getTagNames(config: any[]): string[] {
        const tagNames: string[] = [];
        config.forEach(configs => {
            for (const c in configs) {
              if (configs.hasOwnProperty(c)) {
                const el =  configs[c];
                if (tagNames.indexOf(el) === -1) {
                  tagNames.push(el);
                }
              }
            }
          });
        return tagNames;
    }

    addServerName(reportConfigs: any[]): any[] {
        const server: ServersStateModel = this.store.selectSnapshot(ServersState);
        const serverName = server.serverSelected;
        reportConfigs.forEach(configs => {
          for (const config in configs) {
            if (configs.hasOwnProperty(config)) {
              configs[config] = serverName  + configs[config];
            }
          }
        });
        return reportConfigs;
    }

    getRequetReportCurrents(tagIds: number[]): DataRead {
        const id =  UUID.UUID();
        const req: DataRead = {
            RequestId: id,
            Mode: ValueType.RealTime,
            ItemIds: tagIds
          };
          return req;
    }
}
