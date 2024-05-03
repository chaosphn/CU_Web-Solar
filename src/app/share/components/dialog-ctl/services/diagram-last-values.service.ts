import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { DiagramLastValuesState } from '../../../../core/stores/last-values/diagram/diagram-last-values.state';
import { TagsStateModel } from '../../../../core/stores/tags/tags.model';
import { TagsState } from '../../../../core/stores/tags/tags.state';
import { SingleValue } from '../../../models/value-models/group-data.model';
import { ValueType } from '../../../models/value-models/value-type.model';
import { DiagramConfigStateModel } from '../../../../core/stores/configs/diagram/diagram-config.model';
import { DiagramConfigsState } from '../../../../core/stores/configs/diagram/diagram-config.state';
import { DiagramLastValuesStateModel } from '../../../../core/stores/last-values/diagram/diagram-last-values.model';
import { DiagramRequestStateModel } from '../../../../core/stores/requests/diagram/diagram-request.model';
import { DiagramRequestState } from '../../../../core/stores/requests/diagram/diagram-request.state';

@Injectable({
    providedIn: 'root'
})
export class DiagramLastValuesService {

    constructor(private store: Store) { }

    getCurrentGroupData(): SingleValue {
        const singValues: SingleValue = {};
        // const currConfigs: DiagramConfigStateModel[] = this.store.selectSnapshot(DiagramConfigsState.getConfigs(ValueType.RealTime));
        // currConfigs.forEach(config => {
        //     const tagInfo: TagsStateModel = this.store.selectSnapshot(TagsState.getTagId(config.tagName));
        //     if (tagInfo) {
        //         const currReq: DiagramRequestStateModel[] = [];//this.store.selectSnapshot(DiagramRequestState.getRequest());
        //         const reqId = currReq[0].RequestId;
        //         const lastValues: DiagramLastValuesStateModel[] = this.store.selectSnapshot(DiagramLastValuesState.getLastValues(reqId));
        //         if (lastValues && lastValues.length > 0) {
        //             const lastValue = lastValues[0].DataSets.find(l => l.ItemId === tagInfo.Id);
        //             const dataRecords = (lastValue) ? lastValue.Records : [];

        //             singValues[config.name] = {
        //                 tagNames: [config.tagName],
        //                 maxValue: tagInfo.Options.maximum,
        //                 minValue: tagInfo.Options.minimum,
        //                 dataRecords: dataRecords,
        //                 title: config.title,
        //                 name: config.name,
        //                 unit: tagInfo.Options.unit
        //             };
        //         }

        //     }
        // });
        return singValues;
    }


    getAtTimeGroupData(): SingleValue {
        const singValues: SingleValue = {};
        // const atTimeConfigs: DiagramConfigStateModel[] = this.store.selectSnapshot(DiagramConfigsState.getConfigs(ValueType.AtTime));
        // atTimeConfigs.forEach(config => {
        //     const tagInfo: TagsStateModel = this.store.selectSnapshot(TagsState.getTagId(config.tagName));
        //     if (tagInfo) {
        //         const atTimeReq: DiagramRequestStateModel[] = [];//this.store.selectSnapshot(DiagramRequestState.getRequest());
        //         const reqId = atTimeReq[0].RequestId;
        //         const lastValues: DiagramLastValuesStateModel[] = this.store.selectSnapshot(DiagramLastValuesState.getLastValues(reqId));
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
