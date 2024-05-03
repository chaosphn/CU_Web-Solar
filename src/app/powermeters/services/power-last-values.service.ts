import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { PowerLastValuesState } from '../../core/stores/last-values/powermeter/power-last-values.state';
import { TagsStateModel } from '../../core/stores/tags/tags.model';
import { TagsState } from '../../core/stores/tags/tags.state';
import { SingleValue, SingleValue1 } from '../../share/models/value-models/group-data.model';
import { ValueType } from '../../share/models/value-models/value-type.model';
import { PowerConfigStateModel, PowerConfigsRealtime } from '../../core/stores/configs/powermeter/power-config.model';
import { PowerConfigsState } from '../../core/stores/configs/powermeter/power-config.state';
import { PowerLastValuesModel, PowerLastValuesStateModel } from '../../core/stores/last-values/powermeter/power-last-values.model';
import { PowerRequestStateModel } from '../../core/stores/requests/powermeter/power-request.model';
import { PowerRequestState } from '../../core/stores/requests/powermeter/power-request.state';

@Injectable({
    providedIn: 'root'
})
export class PowerLastValuesService {

    constructor(private store: Store) { }

    getCurrentGroupData(): SingleValue1 {
        const singValues: SingleValue1 = {};
        let currConfigs: PowerConfigsRealtime[] = this.store.selectSnapshot(PowerConfigsState.getRealtimeConfigs());
        currConfigs.forEach(config => {
            const tag = config;
            if (tag) {
                //console.log(tag)
                const lastValues: PowerLastValuesModel[] = this.store.selectSnapshot(PowerLastValuesState.getLastValuesRealtime(tag.Name));
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
        // const atTimeConfigs: PowerConfigStateModel[] = this.store.selectSnapshot(PowerConfigsState.getConfigs(ValueType.AtTime));
        // atTimeConfigs.forEach(config => {
        //     const tagInfo: TagsStateModel = this.store.selectSnapshot(TagsState.getTagId(config.tagName));
        //     if (tagInfo) {
        //         const atTimeReq: PowerRequestStateModel[] = this.store.selectSnapshot(PowerRequestState.getRequest(ValueType.AtTime));
        //         const reqId = atTimeReq[0].RequestId;
        //         const lastValues: PowerLastValuesStateModel[] = this.store.selectSnapshot(PowerLastValuesState.getLastValues(reqId));
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
