import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { Chart, Highcharts} from 'angular-highcharts';
//import HC_exporting from 'highcharts/modules/exporting';
import { HIGHCHARTS_MODULES } from 'angular-highcharts';
import { ChartEvent, ChartParameters, ChartParametersAdapter } from '../../models/sat-chart';
import { ResetZoom, SetZoom } from './../../../core/stores/configs/dashboard/dashboard-configs.state';
import { chart, charts } from 'highcharts';
import * as FileSaver from 'file-saver';
//import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

export class DateTime {
  constructor() { }

  getMonth(index: number) {
    const month = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return month[index];
  }
}

@Component({
  selector: 'app-sat-chart',
  templateUrl: './sat-chart.component.html',
  styleUrls: ['./sat-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SatChartComponent implements OnInit, OnDestroy, OnChanges {

  @Input() height;
  @ViewChild('chartEl')
  chartEl: ElementRef;
  id: string;
  _opacity = '1';
  _ylabel = false;
  _xlabel = false;
  @Input() data: any[];

  x = [[3743366400, 55], [3743366401, 80]];
  seriesData: Highcharts.IndividualSeriesOptions[] = [
    {
      name: 'Power',
      type: 'area',
      color: 'rgb(100, 167, 100)',
      // data: [55, 80, 115, 138, 184.0, 186.0, 145.6, 148.5, 226.4, 204.1, 100.6, 80, 70, 80, 90, 100],
      data: [[3743366400, 55], [3743366401, 80], [3743366402, 115], [3743366403, 138], [3743366404, 184], [3743366405, 0], [3743366406, 186], [3743366407, 145],]
    },
    {
      name: 'Power',
      type: 'spline',
      color: 'rgb(255, 0, 255)',
      // data: [55, 80, 115, 138, 184.0, 186.0, 145.6, 148.5, 226.4, 204.1, 100.6, 80, 70, 80, 90, 100],
      data: [[3743366400, 55], [3743366401, 80], [3743366402, 115], [3743366403, 138], [3743366404, 184], [3743366405, 0], [3743366406, 186], [3743366407, 145],]
    },
  ];

  chart: Chart;
  _series: any[];
  _yaxis: any[];
  _xaxis: any[];


  @Input() chartParameters: ChartParameters;

  chartsData: any[] = [];
  @ViewChild('excelTable') excelTable: ElementRef;

  constructor(private cd: ChangeDetectorRef, private store: Store) {

  }

  public ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.chartParameters) {
      this.initChartNew(this.chartParameters);
      if(this.chart != null){
        //this.initTable();
      }
    }
  }

  zoomChart(event) {
    if (event.type === 'selection' && event.resetSelection) {
      const id = this.chartParameters.id;
      this.store.dispatch(new ResetZoom(id));
    }
    else if (event.type === 'selection' && event.xAxis && event.xAxis.length > 0) {
      const id = this.chartParameters.id;
      const xAxis = event.xAxis[0];
      this.store.dispatch(new SetZoom(id, xAxis.min, xAxis.max));
    }
  }

  setPositionTooltip(labelWidth, labelHeight, point) {
    // console.log(this);
    // console.log(this.chartEl.nativeElement.clientHeight);
    // console.log(this.chartEl.nativeElement.clientWidth);
    const plotWidth = this.chartEl.nativeElement.clientWidth;
    //console.log(point.plotX + labelWidth);
    if (point.plotX + labelWidth > plotWidth - 100) {
      //console.log('left');
      const tooltipX = point.plotX - (labelWidth / 2) - 20;
      return {
        x: tooltipX,
        y: 10
      };
  } else {
    //console.log('right');
    const tooltipX = point.plotX + 60;
    return {
      x: tooltipX,
      y: 10
    };
  }


  }

  initChartNew(_params: ChartParameters) {
    const _config = new ChartParametersAdapter(_params);
    _config.chartParams.eventEmitter.on(ChartEvent.AddPoint, this.addPoint.bind(this));
    _config.chartParams.eventEmitter.on(ChartEvent.Redraw, this.redraw.bind(this));
    _config.chartParams.eventEmitter.on(ChartEvent.ChangeSerie, this.changeSerie.bind(this));

    //console.log(_config.getSeries())

    const chart = new Chart({
      credits: {
        enabled: false,
      },
      chart: {
        animation: false,
        marginTop: 30,
        zoomType: 'x',
        backgroundColor: '#f8f8f8',
        events: {
          selection: this.zoomChart.bind(this)
      },
        resetZoomButton: {
          position: {
            // x: +50,
             y: -40,
            verticalAlign: 'bottom', // by default
          },
          theme: {
            fill: '#FD674E',
            style: {
              color: 'white'
            },
            states: {
              hover: {
                fill: '#FD674E',
                style: {
                  color: 'white'
                },
              }
            }
          },
          relativeTo: 'chart'
        }
      },
      xAxis: _config.getXAxis(),
      legend: _config.getLegend(),
      series: _config.getSeries(),
      title: {
        text: '',
        // margin: -50
      },
      yAxis: _config.getYAxis(),
      exporting: {
        enabled: true,
        allowHTML: true,
        buttons: {
          contextButton:{
            enabled: false,
            menuItems: ["viewFullscreen", "printChart", "separator", "downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG"],
          }
        }

      },
      tooltip: {
        // positioner: function (labelWidth, labelHeight, point) {
        //   const tooltipX = point.plotX + 60;
        //   const tooltipY = labelHeight;
        //   return {
        //     x: tooltipX,
        //     y: 10
        //   };
        // },
        positioner: this.setPositionTooltip.bind(this),
        // pointFormat: '{series.name}: <b style="color:red">{point.y}</b>  <br/>',
        formatter: function () {
          const dateTime: Date = new Date(this.x);
          const dt = new DateTime();
          const montnFormat = dt.getMonth(dateTime.getMonth());
          // d-MMM-yy
          const dateFormat = ('0' + dateTime.getDate()).slice(-2);
          const yearFormat = ('0' + dateTime.getFullYear()).slice(-2);
          const hourFormat = ('0' +dateTime.getHours()).slice(-2);
          const minFormat = ('0' +dateTime.getMinutes()).slice(-2);
          const timeStamp = (dateTime.getFullYear() > 1500) ? `${dateFormat}-${montnFormat}-${yearFormat} ${hourFormat}:${minFormat}` : '';
          
          let s = `<div style="margin-bottom:5px;"><span style="font-weight:500;color:rgba(0, 0, 0, 0.9);">${timeStamp}</span></div>`;
          s += '<table style="font-size:11px">';
          if (this.points.length > 0) {
            this.points.forEach(p => {
              if(dateTime.toString() == 'Invalid Date' || dateTime.getFullYear() < 2000 || dateTime.getFullYear() > 3000)
              { 
                s += '<tr><td style="color:rgba(0, 0, 0, 0.9);font-weight:500">' + p.x + '</td> <td style="padding-left:12px;font-weight:bold;color: ' + p.color + '"> ' + +(p.y).toFixed(2) + '</td></tr>';
              }
              else{
                s += '<tr><td style="color:rgba(0, 0, 0, 0.9);font-weight:500">' + p.series.name + '</td> <td style="padding-left:12px;font-weight:bold;color: ' + p.color + '"> ' + +(p.y).toFixed(2) + ' </td></tr>';
              }
              //s += '<tr><td style="color:rgba(0, 0, 0, 0.9);font-weight:500">' + p.series.name + '</td> <td style="padding-left:12px;font-weight:bold;color: ' + p.color + '"> ' + +(p.y).toFixed(2) + '</td></tr>';
            });
          }
          s += '</table>';
          return s;
        },
        useHTML: true,
        valueDecimals: 2,
        shared: true,
        headerFormat: '',
        shadow: false,
        shape: 'rect',
        backgroundColor: 'rgba(255,255,255,1)',
        borderColor: '#3DB1FC'
        // borderWidth: 0,
      },
      plotOptions: _config.getPlotOption()
    });
    this.chart = chart;
    this.cd.markForCheck();
    
  }


  public initChart(_params: ChartParameters) {

  }

  ngOnDestroy() {
    // this.subScriptions.forEach(s => s.unsubscribe());
  }

  test(value: boolean) {
    this.chart.ref.update({ xAxis: { labels: { enabled: value } } });
  }

  downloadChart(){
    console.log("download chart.")
    // this.chart.ref.exportChart({
    //     type: 'application/pdf',
    //     filename: 'chart_data',
    // });
    const Data: any[] = [];
    this.chart.ref.series[0].data.forEach((item, index) => {
      const time = new Date(item.x).toISOString();
      const raw: ChartData = {
        Timestamp: time.toString(),
        Value: item.y.toString()
      }
      Data.push(raw);
      this.chartsData.push(raw);
    })
    console.log(this.chartsData)
    this.exportAsExcelFile(Data, "ChartData")
  }

  exportAsExcelFile(json: any[], excelFileName: string): void {  
    // const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);  
    // const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };  
    // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });  
    //this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});   
    FileSaver.saveAs(data, fileName + " " + new Date() + EXCEL_EXTENSION);
  }



  addPoint(pointName: string, data: [any, number][]) {
    data.forEach(d => {
      const _chart = this.chart.ref.series.find(x => x.name === pointName);
      if (_chart) {
        _chart.addPoint([d[0], d[1]], false, false);
      }

    });
  }

  changeSerie(serieName: string, data: [number, number][]) {
    const _chart = this.chart.ref.series.find(x => x.name === serieName);
    _chart.setData(data);
  }

  redraw() {
    if (this.chart.ref.redraw) {
      this.chart.ref.redraw();
    }
  }

  public AddSeries(series: Highcharts.IndividualSeriesOptions[]) {
    series.forEach(x =>
      this.chart.addSerie(x)
    );
  }

  public UpdateSeries(series: Highcharts.IndividualSeriesOptions[]) {
    this.chart.ref.update({ series: series }, true);
  }

  public ClearSerie() {
    const cnt: number = this.chart.ref.series.length - 1;
    let i = 0;
    for (i = cnt; i >= 0; i--) {
      this.chart.ref.series[i].remove();
    }
  }

  public ChangeType(Type: string, Index: number) {
    let i: number;
    const s: any[] = new Array(Index + 1);
    for (i = 0; i <= Index; i++) {
      if (i !== Index) {
        s[i] = {};
      }
      else {
        s[i] = { type: Type };
      }
    }
    this.chart.ref.update({ series: s });
  }

  public ChangeColor(Color: string, Index: number) {
    let i: number;
    const s: any[] = new Array(Index + 1);
    for (i = 0; i <= Index; i++) {
      if (i !== Index) {
        s[i] = {};
      }
      else {
        s[i] = { color: Color };
      }
    }
    this.chart.ref.update({ series: s });
  }

  public addData(data: number[]) {
    data.forEach((x, index) => this.chart.addPoint(x, index));
  }

  public SetTitle(title: string) {
    this.chart.ref.update({ title: { text: title } });
  }

}

export interface ChartData{
  Timestamp:string;
  Value:string;
}
