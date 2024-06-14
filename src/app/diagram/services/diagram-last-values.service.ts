import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { DiagramLastValuesState } from '../../core/stores/last-values/diagram/diagram-last-values.state';
import { TagsStateModel } from '../../core/stores/tags/tags.model';
import { TagsState } from '../../core/stores/tags/tags.state';
import { SingleValue, SingleValue1 } from '../../share/models/value-models/group-data.model';
import { ValueType } from '../../share/models/value-models/value-type.model';
import { DiagramConfigStateModel } from './../../core/stores/configs/diagram/diagram-config.model';
import { DiagramConfigsState } from './../../core/stores/configs/diagram/diagram-config.state';
import { DiagramLastValuesModel, DiagramLastValuesStateModel } from './../../core/stores/last-values/diagram/diagram-last-values.model';
import { DiagramRequestStateModel } from './../../core/stores/requests/diagram/diagram-request.model';
import { DiagramRequestState } from './../../core/stores/requests/diagram/diagram-request.state';
import { DiagramConfigModel } from 'src/app/share/models/diagram-config.model';

@Injectable({
    providedIn: 'root'
})
export class DiagramLastValuesService {

    constructor(private store: Store) { }

    getCurrentGroupData(): SingleValue1 {
        const singValues: SingleValue1 = {};
        let currConfigs: DiagramConfigModel[] = this.store.selectSnapshot(DiagramConfigsState.getConfigs1());
        currConfigs.forEach(config => {
            const tag = config;
            if (tag) {
                const lastValues:DiagramLastValuesModel[] = this.store.selectSnapshot(DiagramLastValuesState.getLastValuesWithName(tag.Name));
                if(lastValues.length > 0){
                    singValues[tag.Title] = {
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

}
