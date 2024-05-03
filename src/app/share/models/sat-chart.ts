import { EventEmitter } from 'events';
import { range } from 'rxjs';

export interface SatChart {
    data: [number | string[], number[]];
    color: string;
    type: string;

    initChart(title: string, ytitle: any, yuom: string, xlabel: boolean, legend: boolean, DateFormat: string, series: Highcharts.IndividualSeriesOptions[]);
    addData(data: number[], sindex: string);
    addPoint(point: number);
    AddSeries(series: Highcharts.IndividualSeriesOptions[]);
    ChangeType(Type: string, Index: number);
    ChangeColor(Color: string, Index: number);
    ClearSeries();
    ngOnInit();
    SetTitle(title: string);
}


export interface SatChartTest {
    title: string;
}


export enum DateOptions {
    Fulldate = '{value:%d-%m-%Y %H:%M:%S}',
    TimeOnly = '{value:%H:%M:%S}',
    HourOnly = '{value:%H}',
    MonthYear = '{value:%m-%Y}'
}

export enum XAxisType {
    datetime = 'datetime',
    string = 'category'
}

export enum HAlign {
    left = 'left',
    right = 'right',
    center = 'center'
}

export enum LegendLayout {
    horizontal = 'horizontal',
    vertical = 'vertical',
    proximate = 'proximate'
}

export enum VAlingn {
    top = 'top',
    middle = 'middle',
    bottom = 'bottom'
}

export enum SerieType {
    line = 'spline',
    area = 'area',
    bar = 'column'
}

export enum LegendAlign {
    left = 'left',
    center = 'center',
    right = 'right',
}

export class Series {
    name: string;
    type?= SerieType.line;
    color?= 'blue';
    yaxis?= 0;
    xaxis?=0;
    data: [number, number][] | [string, number][] | Highcharts.DataPoint[];
    visible?= true;
    showInLegend? = true;
}

export class PushData {
    name: string;
    data: [number, number][] | [string, number][] | Highcharts.DataPoint[];
}

export class YAxisParameters {
    title?= 'default title';
    lineColor?= 'gray';
    lineWidth?= 1;
    ymin?= undefined;
    ymax?= undefined;
    labelEnable?= true;
    labelFormat?= '{value}';
    labelUnit?= '';
    opposite?= false;
    visible?= false; 
}

export class XAxisParameters {
    labelType?: XAxisType = XAxisType.datetime;
    labelDateformat?: DateOptions = DateOptions.Fulldate;
    labelEnable?= true;
    categories?: string[];
    max?: any;
    min?: any;
    tickInterval? :any;
}

export class PlotOption {
    linewidth?= 1;
}

export class LegendParameter {
    legendEnable?= true;
    lengendFloating?: true;
    HorizontalAlign?: HAlign = HAlign.left;
    VerticalAlign?: VAlingn = VAlingn.bottom;
    XPostion ?= 0;
    YPosition?= 0;
    layout?: LegendLayout = LegendLayout.horizontal;
    align?: LegendAlign = LegendAlign.center;
}


export class ChartParameters {
    public xAxis: XAxisParameters;
    public yAxis: YAxisParameters[];
    public series: Series[];
    public title: string;
    public legend: LegendParameter;
    public plotOption: PlotOption;

    eventEmitter = new EventEmitter();

    constructor(public id: string) {

    }

    addSeries(series?: Series[]) {
        this.series = series;
    }

    addXAxis(xAxis: XAxisParameters) {
        this.xAxis = xAxis;
    }

    addYAxis(yAxis: YAxisParameters[]) {
        
        this.yAxis = yAxis;
    }

    setTitle(title: string) {
        this.title = title;
    }

    addPoint(SerieName: string, data: [number, number][]) {
        this.eventEmitter.emit(ChartEvent.AddPoint, SerieName, data);
    }

    changeSerie(serieName: string, data: [number, number][]) {
        this.eventEmitter.emit(ChartEvent.AddPoint, serieName, data);
    }

    redraw() {
        this.eventEmitter.emit(ChartEvent.Redraw);
    }

    setLegend(Legend: LegendParameter) {
        this.legend = Legend;
    }

    setInterVal(ena :boolean,int: number) {
        if(ena == true){
            this.xAxis.tickInterval = int;
        }
        else{
            this.xAxis.tickInterval =false;
        }
    }

}


export class ChartParametersAdapter {
    chartParams: ChartParameters;

    constructor(_params: ChartParameters) {
        this.chartParams = _params;
    }


    getYAxis(): any | any[] {
        const _yAxis: any | any[] = [];
        if (this.chartParams.yAxis) {
            this.chartParams.yAxis.forEach(y => {

                const _x = (y.opposite) ? -75 : 10;
                if (y.ymin && y.ymax) {
                    _yAxis.push({
                        lineColor: y.lineColor || 'gray',
                        lineWidth: y.lineWidth || 2,
                        endOnTick: false,
                        tickPositioner: function () {
                            const max: number = this.options.max;
                            const min: number = this.options.min;
                            const diff = max - min;
                            const interval = diff / 4;
                            const arr: number[] = [min];
                            range(1, 4).forEach(i => {
                                if (i === 4) {
                                    arr.push(Math.ceil(max));
                                }
                                else {
                                    const _val = i * interval;
                                    arr.push(Math.ceil(_val));
                                }
                            });
                            return arr;
                        },
                        labels: {
                            enabled: y.labelEnable || true,
                            // format: y.labelFormat || '{value:,.0f}',
                            format: '{value:,.0f}',
                        },
                        max: +y.ymax,
                        min: +y.ymin,
                        opposite: y.opposite,
                        title: {
                            reserveSpace: false,
                            text: y.title || null,
                            align: 'high',
                            style: {
                                'text-anchor': 'start'
                            },
                            min: y.ymin || null,
                            max: y.ymax || null,
                            rotation: 0,
                            y: -15,
                            x: _x
                        },
                        visible: y.visible || null
                    });
                }
                else {
                    _yAxis.push({
                        lineColor: y.lineColor || 'gray',
                        lineWidth: y.lineWidth || 2,
                        endOnTick: false,
                        tickAmount: 5,
                        labels: {
                            enabled: y.labelEnable || true,
                            // format: y.labelFormat || '{value:,.0f}',
                            format: '{value:,.0f}',
                        },
                        opposite: y.opposite,
                        title: {
                            reserveSpace: false,
                            text: y.title || null,
                            align: 'high',
                            style: {
                                'text-anchor': 'start'
                            },
                            rotation: 0,
                            y: -15,
                            x: _x
                        },
                        visible: y.visible || null
                    });
                }



            });
        }
        else {
            _yAxis.push({
                endOnTick: false,
                lineColor: 'gray',
                lineWidth: 2,
                label: {
                    enable: true,
                    format: '{value}',
                    reserveSpace: false
                },
                // endOnTick: false,
                // maxPadding: 0.1,
                oposite: false,
                // max: y.ymax,
                title: {
                    reserveSpace: false,
                    text: null,
                    align: 'high',
                    style: {
                        'text-anchor': 'start'
                    },
                    rotation: 0,
                    y: -25,
                    x: 25
                }
            });
        }
        return _yAxis;
    }

    getYAxis1(): any | any[] {
        const _yAxis: any | any[] = [];
        if (this.chartParams.yAxis) {
            this.chartParams.yAxis.forEach(y => {

                const _x = (y.opposite) ? -75 : 10;
                if (y.ymin && y.ymax) {
                    _yAxis.push({
                        lineColor: y.lineColor || 'gray',
                        lineWidth: y.lineWidth || 2,
                        endOnTick: false,
                        tickPositioner: function () {
                            const max: number = this.options.max;
                            const min: number = this.options.min;
                            const diff = max - min;
                            const interval = diff / 4;
                            const arr: number[] = [min];
                            range(1, 4).forEach(i => {
                                if (i === 4) {
                                    arr.push(Math.ceil(max));
                                }
                                else {
                                    const _val = i * interval;
                                    arr.push(Math.ceil(_val));
                                }
                            });
                            return arr;
                        },
                        labels: {
                            enabled: y.labelEnable || true,
                            // format: y.labelFormat || '{value:,.0f}',
                            format: '{value:,.0f}',
                        },
                        max: +y.ymax,
                        min: +y.ymin,
                        opposite: y.opposite,
                        title: {
                            reserveSpace: false,
                            text: y.title || null,
                            align: 'high',
                            style: {
                                'text-anchor': 'start'
                            },
                            min: y.ymin || null,
                            max: y.ymax || null,
                            rotation: 0,
                            y: -15,
                            x: _x
                        },
                        visible: y.visible || false
                    });
                }
                else {
                    _yAxis.push({
                        lineColor: y.lineColor || 'gray',
                        lineWidth: y.lineWidth || 2,
                        endOnTick: false,
                        tickAmount: 5,
                        labels: {
                            enabled: y.labelEnable || true,
                            // format: y.labelFormat || '{value:,.0f}',
                            format: '{value:,.0f}',
                        },
                        opposite: y.opposite,
                        title: {
                            reserveSpace: false,
                            text: y.title || null,
                            align: 'high',
                            style: {
                                'text-anchor': 'start'
                            },
                            rotation: 0,
                            y: -15,
                            x: _x
                        },
                        visible: y.visible || false
                    });
                }



            });
        }
        else {
            _yAxis.push({
                endOnTick: false,
                lineColor: 'gray',
                lineWidth: 2,
                label: {
                    enable: true,
                    format: '{value}',
                    reserveSpace: false
                },
                // endOnTick: false,
                // maxPadding: 0.1,
                oposite: false,
                // max: y.ymax,
                title: {
                    reserveSpace: false,
                    text: null,
                    align: 'high',
                    style: {
                        'text-anchor': 'start'
                    },
                    rotation: 0,
                    y: -25,
                    x: 25
                }
            });
        }
        return _yAxis;
    }

    getLegend(): any {        
        let _legend: any = {};
        if (this.chartParams.legend) {
            //console.log(this.chartParams.legend)
            if (this.chartParams.legend.legendEnable) {
                //console.log("1");
                _legend = {
                    enable: this.chartParams.legend.legendEnable,
                    // enable: false,
                    floating: this.chartParams.legend.lengendFloating,
                    align: this.chartParams.legend.HorizontalAlign,
                    verticalAlign: (this.chartParams.legend.legendEnable) ? this.chartParams.legend.VerticalAlign : null,
                    x: this.chartParams.legend.XPostion,
                    y: this.chartParams.legend.YPosition,
                    layout: this.chartParams.legend.layout || LegendLayout.horizontal,
                    reversed: true
                };
            }
            else {
                //console.log("2");
                _legend = {
                    enable: false,
                    floating: true,
                    verticalAlign: VAlingn.top,
                    align: 'center',
                    x: 0,
                    y: -13,
                };
            }
        }
        else {
            //console.log("3");
            _legend = {
                enable: true,
                floating: true,
                align: HAlign.right,
                verticalAlign: VAlingn.top,
                layout: 'vertical',
                itemStyle: {
                    fontWeight: 'bold',
                    fontSize: '10px'
                },
                style: {
                    letterSpacing: '-0.5px'
                }
                // x: 0,
                // y: 0,
                // itemMarginTop: -25,
                // squareSymbol: true,
                // align: 'right',
                // verticalAlign: 'top',
                // layout: 'vertical',
            };
        }
        return _legend;
    }

    getLegend1(): any {        
        let _legend: any = {};
        if (this.chartParams.legend) {
            //console.log(this.chartParams.legend)
            if (this.chartParams.legend.legendEnable) {
                //console.log("1");
                _legend = {
                    enable: this.chartParams.legend.legendEnable,
                    // enable: false,
                    floating: this.chartParams.legend.lengendFloating,
                    align: this.chartParams.legend.HorizontalAlign,
                    verticalAlign: (this.chartParams.legend.legendEnable) ? this.chartParams.legend.VerticalAlign : null,
                    x: this.chartParams.legend.XPostion,
                    y: this.chartParams.legend.YPosition,
                    layout: this.chartParams.legend.layout || LegendLayout.horizontal,
                    reversed: true
                };
            }
            else {
                //console.log("2");
                _legend = {
                    enable: false,
                    floating: true,
                    verticalAlign: VAlingn.top,
                    align: 'center',
                    x: 0,
                    y: -13,
                };
            }
        }
        else {
            //console.log("3");
            _legend = {
                enable: true,
                floating: true,
                align: HAlign.right,
                verticalAlign: VAlingn.top,
                layout: 'vertical',
                itemStyle: {
                    fontWeight: 'bold',
                    fontSize: '10px'
                },
                style: {
                    letterSpacing: '-0.5px'
                }
                // x: 0,
                // y: 0,
                // itemMarginTop: -25,
                // squareSymbol: true,
                // align: 'right',
                // verticalAlign: 'top',
                // layout: 'vertical',
            };
        }
        //console.log(_legend)
        return _legend;
    }

    getXAxis(): any | any[] {
        const _xAxis: any | any[] = [];
        if (this.chartParams.xAxis) {
            _xAxis[0] = {
                type: (this.chartParams.xAxis.categories) ? null : this.chartParams.xAxis.labelType,
                label: {
                    enable: this.chartParams.xAxis.labelEnable,
                    format: this.chartParams.xAxis.labelDateformat,
                },
                tickInterval: this.chartParams.xAxis.tickInterval,
                lineWidth: 2,
                lineColor: '#808080',
                max: this.chartParams.xAxis.max,
                crosshair: true,
                min: this.chartParams.xAxis.min,
                categories: (this.chartParams.xAxis.categories) ? this.chartParams.xAxis.categories : null
            };

        }
        else {
            _xAxis[0] = {
                type: 'category',
                lineWidth: 2,
                lineColor: '#808080',
                crosshair: true,
                label: {
                    enable: true,
                    format: '{value:%d-%m-%Y %H:%M:%S}',
                }
            };
        }
        return _xAxis;
    }

    getSeries(): Highcharts.IndividualSeriesOptions[] {
        // const _series: Highcharts.IndividualSeriesOptions[] = [];
        const _series: any[] = [];
        if (this.chartParams.xAxis && this.chartParams.xAxis.categories) {  
       
            
            const data: number[] = [];
            this.chartParams.series.forEach(s => {
                if (s.data[0][1] !== null) {
                    data.push(s.data[0][1]);
                }
            });

            _series.push({
                name: this.chartParams.id,
                type: 'column',
                color: '#3DB1FC',
                data: data,
                showInLegend: false
                // visible: 
                // yAxis: s.yaxis,
            });
        }
        else {
            if (this.chartParams.series) {
                const seriesLength = this.chartParams.series.length;
                this.chartParams.series.forEach(s => {
                    _series.push({
                        name: s.name,
                        type: s.type,
                        color: s.color,
                        data: s.data ,
                        yAxis: s.yaxis,
                        visible: s.visible,
                        showInLegend: (seriesLength > 1) ? s.showInLegend : false
                    });
                });
            }
        }

        return _series;
    }

    getPlotOption(): any {
        let _plotOption: any = {};
        if (this.chartParams.plotOption) {
            _plotOption = {
                series: {
                    lineWidth: this.chartParams.plotOption.linewidth,
                    animation: false,
                    marker: {
                        enabled: false
                    },
                    pointPadding: 0,
                    groupPadding: 0.1,
                    fillOpacity: 0.1
                },
            };
        }
        else {
            _plotOption = {
                series: {
                    lineWidth: 2,
                    animation: false,
                    marker: {
                        enabled: false
                    },
                    pointPadding: 0,
                    groupPadding: 0.1,
                    fillOpacity: 0.1
                }
            };
        }
        return _plotOption;
    }

    getTitle() {
        const str = this.chartParams.title || null;
        return str;
    }
}



export enum ChartEvent {
    AddPoint = 'addPoint',
    Redraw = 'redraw',
    ChangeSerie = 'changeSerie'
}
