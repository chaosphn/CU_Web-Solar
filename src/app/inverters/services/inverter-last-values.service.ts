import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { InverterLastValuesState } from '../../core/stores/last-values/inverter/inverter-last-values.state';
import { TagsStateModel } from '../../core/stores/tags/tags.model';
import { TagsState } from '../../core/stores/tags/tags.state';
import { SingleValue, SingleValue1 } from '../../share/models/value-models/group-data.model';
import { ValueType } from '../../share/models/value-models/value-type.model';
import { InverterConfigStateModel, InverterConfigsRealtime } from '../../core/stores/configs/inverter/inverter-config.model';
import { InverterConfigsState } from '../../core/stores/configs/inverter/inverter-config.state';
import { InverterLastValuesStateModel, InverterLastValuesModel } from '../../core/stores/last-values/inverter/inverter-last-values.model';
import { InverterRequestStateModel } from '../../core/stores/requests/inverter/inverter-request.model';
import { InverterRequestState } from '../../core/stores/requests/inverter/inverter-request.state';

@Injectable({
    providedIn: 'root'
})
export class InverterLastValuesService {

    constructor(private store: Store) { }

    getCurrentGroupData(): SingleValue1 {
        const singValues: SingleValue1 = {};
        let currConfigs: InverterConfigsRealtime[] = this.store.selectSnapshot(InverterConfigsState.getRealtimeConfigs());
        currConfigs.forEach(config => {
            const tag = config;
            if (tag) {
                //console.log(tag)
                const lastValues: InverterLastValuesModel[] = this.store.selectSnapshot(InverterLastValuesState.getLastValuesRealtime(tag.Name));
                //console.log(lastValues);
                if (lastValues.length > 0 && lastValues[0].DataRecord) {
                    singValues[tag.Name] = {
                        tagNames: [lastValues[0].Name],
                        dataRecords: lastValues[0].DataRecord,
                        unit:lastValues[0].Unit,
                        minValue: lastValues[0].Min,
                        maxValue: lastValues[0].Max
                    };
                }

            }
        });
        //console.log(singValues)
        return singValues;
    }

    getAtTimeGroupData(): SingleValue {
        const singValues: SingleValue = {};
        // const atTimeConfigs: InverterConfigStateModel[] = this.store.selectSnapshot(InverterConfigsState.getConfigs(ValueType.AtTime));
        // atTimeConfigs.forEach(config => {
        //     const tagInfo: TagsStateModel = this.store.selectSnapshot(TagsState.getTagId(config.tagName));
        //     if (tagInfo) {
        //         const atTimeReq: InverterRequestStateModel[] = this.store.selectSnapshot(InverterRequestState.getRequest(ValueType.AtTime));
        //         const reqId = atTimeReq[0].RequestId;
        //         const lastValues: InverterLastValuesStateModel[] = this.store.selectSnapshot(InverterLastValuesState.getLastValues(reqId));
        //         const lastValue = lastValues[0].DataSets.find(l => l.ItemId === tagInfo.Id);
        //         if (lastValues && lastValues.length > 0) {
        //             const dataRecords = (lastValue) ? lastValue.Records : [];
        //             singValues[config.name] = {
        //                 tagNames: [config.tagName],
        //                 maxValue: tagInfo.Maximum,
        //                 minValue: tagInfo.Minimum,
        //                 dataRecords: dataRecords,
        //                 title: config.title,
        //                 name: config.name,
        //                 unit: tagInfo.Unit
        //             };
        //         }
        //     }

        // });
        return singValues;
    }

}
