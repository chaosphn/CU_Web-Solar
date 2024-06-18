import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { DashboardConfigStateModel, DashboardConfigsRealtime, PlotTag, RawTag } from '../../core/stores/configs/dashboard/dashboard-configs.model';
import { DashboardLastValuesModel, DashboardLastValuesStateModel, DataRecords } from '../../core/stores/last-values/dashboard/dashboard-last-values.model';
import { DashboardLastValuesState } from '../../core/stores/last-values/dashboard/dashboard-last-values.state';
import { DashboardRequestStateModel } from '../../core/stores/requests/dashboard/dashboard-request.model';
import { TagsStateModel } from '../../core/stores/tags/tags.model';
import { TagsState } from '../../core/stores/tags/tags.state';
import { Data, MultipleValue, SingleValue, SingleValue1 } from '../../share/models/value-models/group-data.model';
import { ValueType } from '../../share/models/value-models/value-type.model';
import { ChangePeriodName, DashboardConfigsState } from './../../core/stores/configs/dashboard/dashboard-configs.state';
import { DashboardRequestState } from './../../core/stores/requests/dashboard/dashboard-request.state';
import { DateTimeService } from './../../share/services/datetime.service';


@Injectable({
    providedIn: 'root'
})
export class DashboardLastValuesService {

    constructor(private store: Store,
        private dateTimeService: DateTimeService) { }

    getCurrentGroupData(): SingleValue1 {
        const singValues: SingleValue1 = {};
        let currConfigs: DashboardConfigsRealtime[] = this.store.selectSnapshot(DashboardConfigsState.getRealtimeConfigs());
        // console.log(currConfigs+'15464')
        currConfigs.forEach(config => {
            const tag = config;
            if (tag) {
                // console.log(tag+"dawdaw")
                const lastValues:DashboardLastValuesModel[] = this.store.selectSnapshot(DashboardLastValuesState.getLastValuesRealtime(tag.Name));
                ////console.log(this.store.selectSnapshot(DashboardLastValuesState.getLastValuesRealtime(tag)));
                if (lastValues.length > 0 && lastValues[0].DataRecord) {
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

    getHistorianWithData(): MultipleValue {
        const multipleValues: MultipleValue = {};
        return multipleValues;
    }


    getPlotGropData1(config: DashboardConfigStateModel[]): MultipleValue {
        const multipleValues: MultipleValue = {};
        let configs : DashboardConfigStateModel[] = this.store.selectSnapshot(DashboardConfigsState.getChartsConfigs());
        let plotConfigs: DashboardConfigStateModel[] = configs.filter(x => x.type === "Plot");
        plotConfigs.forEach(config => {
            const tags: PlotTag[] = config.tags as PlotTag[];
            const listData: Data[] = [];
            tags.forEach(tag => {
                //const tagInfo: TagsStateModel = this.store.selectSnapshot(TagsState.getTagId(tag.name));
                const lastValues: DashboardLastValuesModel[] = this.store.selectSnapshot(DashboardLastValuesState.getLastValuesHistorian(tag.name));
                if (lastValues.length > 0 && lastValues) {
                    const tagMatch = lastValues.find(x => x.Name === tag.name)
                    if (tagMatch) {
                        const data: Data = {
                            dataRecords: tagMatch.DataRecord,
                            maxValue: tagMatch.Max,
                            minValue: tagMatch.Min,
                            tagNames: [tag.name],
                            title: tag.title,
                            name: tag.name,
                            unit: tagMatch.Unit,
                            options: tag.options,
                        };
                        listData.push(data);
                    }

                }

            });
            multipleValues[config.name] = {};
            multipleValues[config.name].data = [];
            multipleValues[config.name].options = {};
            multipleValues[config.name].data = listData;
            multipleValues[config.name].options = config.options;
        });
        ////console.log(multipleValues);
        return multipleValues;
    }

    getRawGropData1(config: DashboardConfigStateModel[]): MultipleValue {
        const multipleValues: MultipleValue = {};
        let configs : DashboardConfigStateModel[] = this.store.selectSnapshot(DashboardConfigsState.getChartsConfigs());
        let rawConfigs: DashboardConfigStateModel[] = configs.filter(x => x.type === "Raw");
        rawConfigs.forEach(config => {
            const periodName = config.options.runtimeConfigs.periodName;
            let tags: RawTag[] = config.tags as RawTag[];
            tags = tags.filter(x => x.period === periodName);
            const listData: Data[] = [];
            tags.forEach(tag => {
                //const tagInfo: TagsStateModel = this.store.selectSnapshot(TagsState.getTagId(tag.name));
                const lastValues: DashboardLastValuesModel[] = this.store.selectSnapshot(DashboardLastValuesState.getLastValuesHistorian(tag.name));
                if (lastValues.length > 0 && lastValues) {
                    const tagMatch = lastValues.find(x => x.Name === tag.name)
                    if (tagMatch) {
                        const data: Data = {
                            dataRecords: tagMatch.DataRecord,
                            maxValue: tagMatch.Max,
                            minValue: tagMatch.Min,
                            tagNames: [tag.name],
                            title: tag.title,
                            name: tag.name,
                            unit: tagMatch.Unit,
                            options: tag.options,
                        };
                        listData.push(data);
                    }

                }

            });
            multipleValues[config.name] = {};
            multipleValues[config.name].data = [];
            multipleValues[config.name].options = {};
            multipleValues[config.name].data = listData;
            multipleValues[config.name].options = config.options;
        });
        ////console.log(multipleValues);
        return multipleValues;
    }

    getPlotGroupDataWithName(name: string, periodName: string, config: DashboardConfigStateModel[]): MultipleValue {
        const multipleValues: MultipleValue = {};
        this.store.dispatch(new ChangePeriodName(periodName, periodName));
        let configs : DashboardConfigStateModel[] = this.store.selectSnapshot(DashboardConfigsState.getChartsConfigs());
        let plotConfigs: DashboardConfigStateModel = configs.find(x => x.name === name);
        //plotConfigs.options.runtimeConfigs.periodName = periodName;
        //console.log(configs);
        //console.log(config);
        const tags: PlotTag[] = plotConfigs.tags as PlotTag[];
        const listData: Data[] = [];
        tags.forEach(tag => {
            //const tagInfo: TagsStateModel = this.store.selectSnapshot(TagsState.getTagId(tag.name));
            const lastValues: DashboardLastValuesModel[] = this.store.selectSnapshot(DashboardLastValuesState.getLastValuesHistorian(tag.name));
            if (lastValues.length > 0 && lastValues) {
                const tagMatch = lastValues.find(x => x.Name === tag.name)
                if (tagMatch) {
                    const data: Data = {
                        dataRecords: tagMatch.DataRecord,
                        maxValue: tagMatch.Max,
                        minValue: tagMatch.Min,
                        tagNames: [tag.name],
                        title: tag.title,
                        name: tag.name,
                        unit: tagMatch.Unit,
                        options: tag.options,
                    };
                    listData.push(data);
                }
            }
        });

        multipleValues[plotConfigs.name] = {};
        multipleValues[plotConfigs.name].options = {};
        multipleValues[plotConfigs.name].data = listData;
        multipleValues[plotConfigs.name].options = plotConfigs.options;
        ////console.log(multipleValues);
        return multipleValues;
    }

    getRawGroupDataWithName(name: string, periodName: string, config: DashboardConfigStateModel[]): MultipleValue {
        const multipleValues: MultipleValue = {};
        this.store.dispatch(new ChangePeriodName(periodName, periodName));
        let configs : DashboardConfigStateModel[] = this.store.selectSnapshot(DashboardConfigsState.getChartsConfigs());
        const rawConfigs: DashboardConfigStateModel = configs.find(x => x.name === name);
        //rawConfigs.options.runtimeConfigs.periodName = periodName;
        let tags: RawTag[] = rawConfigs.tags as RawTag[];
        const listData: Data[] = [];
        tags.forEach(tag => {
            const lastValues: DashboardLastValuesModel[] = this.store.selectSnapshot(DashboardLastValuesState.getLastValuesHistorian(tag.name));
            if (lastValues.length > 0 && lastValues) {
                const tagMatch = lastValues.find(x => x.Name === tag.name)
                if (tagMatch) {
                    const data: Data = {
                        dataRecords: tagMatch.DataRecord,
                        maxValue: tagMatch.Max,
                        minValue: tagMatch.Min,
                        tagNames: [tag.name],
                        title: tag.title,
                        name: tag.name,
                        unit: tagMatch.Unit,
                        options: tag.options,
                    };
                    listData.push(data);
                }
            }
        });
        multipleValues[rawConfigs.name] = {};
        multipleValues[rawConfigs.name].data = [];
        multipleValues[rawConfigs.name].options = {};
        multipleValues[rawConfigs.name].data = listData;
        multipleValues[rawConfigs.name].options = rawConfigs.options;
        ////console.log(multipleValues);
        return multipleValues;
    }

    getLastTime(id: string): string {
        let timeStr: string = null;
        const lastValues: DashboardLastValuesModel[] = this.store.selectSnapshot(DashboardLastValuesState.getLastValues(id));
        if (lastValues.length > 0) {
            const maxTime: number[] = [];
            lastValues.forEach(item => {
                const timestamp = item.DataRecord[item.DataRecord.length - 1].TimeStamp;
                maxTime.push(new Date(timestamp).getTime());
            });
            const max = Math.min(...maxTime);
            timeStr = this.dateTimeService.getDateTime(new Date(max));
        }
        ////console.log(timeStr);
        return timeStr;
    }
}