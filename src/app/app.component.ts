import {Component, OnInit} from '@angular/core';
import {DataService} from './services/data.service';
import {Color, Label} from 'ng2-charts';
import {ChartDataSets, ChartOptions} from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'StockPred';
  predictions: any;
  changes: any;
  public lineChartData: ChartDataSets[] = [];

  public lineChartLabels: Label[] = [];

  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };

  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this.dataService.getPredictions().subscribe((res: any) => {
      this.predictions = res;
      this.plotChart(this.predictions, 30);
      this.changes = this.getCombinedList(this.predictions.history.slice(0, 5), this.predictions.predictions).reverse();
    });
  }

  plotChart(predictionValues: any, days: number): void {
    const month = predictionValues.history.slice(0, days);
    month.reverse();
    let dates: any[] = [];
    let prices: any[] = [];
    month.forEach((data: any) => {
      dates.push(data.Date);
      prices.push(data.Price);
    });
    const preds = predictionValues.predictions;
    preds.reverse();
    let predValues: any[] = prices.slice(0, days - 5);
    preds.forEach((data: any) => {
      predValues.push(data.Price);
    });
    this.lineChartData = [
      {data: prices, label: 'Actual Price'},
      {data: predValues, label: 'Predicted Price'}
    ];
    this.lineChartLabels = dates;
  }

  changeChart(): void {
    // @ts-ignore
    const days = document.getElementById('days').value;
    this.plotChart(this.predictions, days);
  }

  getCombinedList(actual: any[], predicted: any[]): any {
    let combination: any = [];
    actual.forEach((data: any) => {
      const pred: any = predicted.filter(item => {
        return item.Date === data.Date;
      });
      combination.push({Date: data.Date, Actual: data.Price, Pred: pred[0].Price});
    });
    return combination;
  }
}
