import { Injectable } from '@angular/core';
import { ChartParameters, HAlign, LegendParameter, Series, VAlingn, XAxisParameters, XAxisType, YAxisParameters } from './../../share/models/sat-chart';
import { MultipleData } from './../../share/models/value-models/group-data.model';
import { DateTimeService } from './../../share/services/datetime.service';
import { InverterValue } from './dashboard-inverter.service';
import { isString } from 'util';
import { PeriodTime1 } from 'src/app/share/models/period-time';

@Injectable({
    providedIn: 'root'
})
export class DashboardChartService {

    constructor(private dateTimeService: DateTimeService) { }

    getChartOptions(name: string, data: MultipleData): ChartParameters {

            const chartParams = new ChartParameters(name);
            const series = this.getSeries(data);
    
            let period;
            let xAxis;
            if (data.options.runtimeConfigs.periodName) {
                period = this.dateTimeService.parseDate(data.options.runtimeConfigs.periodName);
            }
     
            if (data.options.chartOptions && data.options.chartOptions.xAxis) {
                xAxis = this.getxAxis(data.options.chartOptions.xAxis.categories);
                //console.log(xAxis);
                //console.log(data.options.chartOptions.xAxis);
                xAxis.tickInterval = data.options.chartOptions.xAxis.tickInterval;
                //console.log(xAxis);
            }
            else {
                xAxis = this.getxAxis();
            }
            if (period) {
                xAxis.max = new Date(period.endTime).getTime();
                xAxis.min = new Date(period.startTime).getTime();
                // console.log("min : " + period.startTime + "\n max : " + period.endTime);
            }
            //console.log(xAxis);
            chartParams.addXAxis(xAxis);
            let enableLegend = true;
            if (data.options && data.options.chartOptions && data.options.chartOptions.legend ) {
                enableLegend = data.options.chartOptions.legend.enable;
            }
    
    
            const legend = this.getLegend(enableLegend);
            const yAxis = this.getyAxis(data.options, data);
            chartParams.setLegend(legend);
            chartParams.addSeries(series);
            if (yAxis) {
                chartParams.addYAxis(yAxis);
            }
            return chartParams; 
    }

    getNewChartOptions(name: string, data: MultipleData, period:PeriodTime1): ChartParameters {

        const chartParams = new ChartParameters(name);
        const series = this.getSeries(data);

        let xAxis;
 
        if (data.options.chartOptions && data.options.chartOptions.xAxis) {
            xAxis = this.getxAxis(data.options.chartOptions.xAxis.categories);
            //console.log(xAxis);
            //console.log(data.options.chartOptions.xAxis);
            xAxis.tickInterval = data.options.chartOptions.xAxis.tickInterval;
            //console.log(xAxis);
        }
        else {
            xAxis = this.getxAxis();
        }
        if (period) {
            xAxis.max = new Date(period.endTime).getTime();
            xAxis.min = new Date(period.startTime).getTime();
            // console.log("min : " + period.startTime + "\n max : " + period.endTime);
        }
        //console.log(xAxis);
        chartParams.addXAxis(xAxis);
        let enableLegend = true;
        if (data.options && data.options.chartOptions && data.options.chartOptions.legend ) {
            enableLegend = data.options.chartOptions.legend.enable;
        }


        const legend = this.getLegend(enableLegend);
        const yAxis = this.getyAxis(data.options, data);
        chartParams.setLegend(legend);
        chartParams.addSeries(series);
        if (yAxis) {
            chartParams.addYAxis(yAxis);
        }
        return chartParams; 
}


    getChartInverter(name: string, data: InverterValue[], options: any): ChartParameters  {
        const chartParams = new ChartParameters(name);
        const series = this.getSeriesInverter(data);
        const xAxis = this.getxAxis(options.chartOptions.xAxis.categories);
        const legend = this.getLegend(false);
        const yAxis = this.getyAxisInverter(options);

        chartParams.addXAxis(xAxis);
        chartParams.setLegend(legend);
        chartParams.addSeries(series);

        if (yAxis) {
            chartParams.addYAxis(yAxis);
        }
        return chartParams;
    }

    getLegend(enable: boolean = true) {
        const legend: LegendParameter = {
            legendEnable: enable,
            lengendFloating: true,
            HorizontalAlign: HAlign.center,
            VerticalAlign: VAlingn.top,
            XPostion: 0,
            YPosition: -10,
        };
        return legend;
    }

    private getSeriesInverter(data: InverterValue[]): Series[] {
        const _series: Series[] = [];
        data.forEach(x => {
            if (x && x.Timestamp) {
                let _d: [number, number];
                //_d = [new Date(x.Timestamp).getTime(), +x.Value];
                _d = [new Date(new Date(x.Timestamp).getTime() ).getTime(), +x.Value];
                _series.push({
                    name: x.Name,
                    data: [_d]
                });
            }
    
        });
        return _series;
    }

    private getSeries(data: any): Series[] {
        
        const _series: Series[] = [];
        data.data.forEach(d => {
            const _dataRecords = d.dataRecords.map(x => {
                let _data: [number, number];
                if (isString(x.Value)) {
                    _data = [new Date(new Date(x.TimeStamp).getTime() ).getTime(), +(x.Value.replace(",", ""))];
                } else {
                    _data = [new Date(new Date(x.TimeStamp).getTime() ).getTime(), +(x.Value)];
                }
                return _data;
              });
              //console.log("dd : " + d.options && d.options.chartOptions && d.options.chartOptions.yAxis);
              const _color = (d.options && d.options.chartOptions && d.options.chartOptions.color) ? d.options.chartOptions.color : null;
              const _yAxis = (d.options && d.options.chartOptions && d.options.chartOptions.yAxis) ? d.options.chartOptions.yAxis : 0;
              const _xAxis = (d.options && d.options.chartOptions && d.options.chartOptions.xAxis) ? d.options.chartOptions.xAxis : 0;
              const _type =  (d.options && d.options.chartOptions && d.options.chartOptions.type) ? d.options.chartOptions.type : 'line';
              _series.push({
               name: d.title,
               data: _dataRecords,
               yaxis: _yAxis,
               xaxis: _xAxis,
               type: _type,
               visible: true,
               color: _color,
            });
        });
        return _series;
    }

    private getxAxis(categories: string[] = [], min?: any, max?: any, tickInterval?:any): XAxisParameters {
        const aXis =  new XAxisParameters();
        aXis.labelEnable = true;
        aXis.max = max;
        aXis.min = min;
        aXis.tickInterval = tickInterval;
      
        aXis.labelType = XAxisType.datetime;
        if (categories.length > 0){ 
            aXis.categories = categories;
        }
        return aXis;
    }

    private getyAxis(options: any, data: MultipleData): YAxisParameters[] {
        const yAxisList:  YAxisParameters[] = [];
        if (options.chartOptions && options.chartOptions.yAxis && options.chartOptions.yAxis.length > 0 ) {
            const yAxis: any[] =  options.chartOptions.yAxis;
            yAxis.forEach((y, i) => {
                const max = (y.useMax && data.data[i] && data.data[i].maxValue) || null;
                const min = (y.useMax && data.data[i] && data.data[i].minValue) || null;
                yAxisList.push({
                    title: y.text || '',
                    opposite: y.opposite || false,
                    lineColor: y.color,
                    ymax: max,
                    ymin: min
                });

            });
        } 
        return (yAxisList.length > 0) ? yAxisList : null;
    }

    private getyAxisInverter(options: any): YAxisParameters[] {
        const yAxisList:  YAxisParameters[] = [];
        if (options.chartOptions && options.chartOptions.yAxis && options.chartOptions.yAxis.length > 0 ) {
            const yAxis: any[] =  options.chartOptions.yAxis;
            yAxis.forEach(y => {
                yAxisList.push({
                    title: y.text || '',
                    opposite: y.opposite || false,
                    lineColor: y.color
                });
            });
        } 
        return (yAxisList.length > 0) ? yAxisList : null;
    }
}

 
