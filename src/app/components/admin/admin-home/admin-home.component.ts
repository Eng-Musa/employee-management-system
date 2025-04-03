import { Component } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-admin-home',
  imports: [HighchartsChartModule],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.scss',
})
export class AdminHomeComponent {
  paid: number = 85;
  unpaid: number = 15;
  updateFlag: boolean = false;

  Highcharts: typeof Highcharts = Highcharts;
  pieChart: Highcharts.Options = {
    chart: {
      type: 'pie',
      plotShadow: false,
      // width: '100%',
      backgroundColor: '#e9ecef',
    },
    credits: {
      enabled: false,
    },
    colors: ['#28a745', '#dc3545'],
    plotOptions: {
      pie: {
        innerSize: '75%',
        slicedOffset: 10,
        dataLabels: {
          enabled: false,
          connectorWidth: 0,
        },
      },
    },
    title: {
      verticalAlign: 'middle',
      floating: true,
      useHTML: true, // Enable HTML for custom styling
      text: `
        <div style="text-align: center; font-family: Arial, sans-serif;">
          <span style="font-size: 12px; color: #6c757d;">Total</span><br>
          <span style="font-size: 14px; font-weight: bold; color: #000;">ksh 1,020,000</span>
        </div>
      `,
    },

    legend: {
      enabled: false,
    },
    tooltip: {
      pointFormat: '{point.name}',
    },
    series: [
      {
        type: 'pie',
        data: [
          { name: 'Paid', y: this.paid, color: '#28a745' },
          { name: 'Unpaid', y: this.unpaid, color: '#dc3545' },
        ],
      },
    ],
    accessibility: {
      enabled: false,
    },
  };

  barChart: Highcharts.Options = {
    chart: {
      type: 'column',
      plotShadow: false,
      backgroundColor: '#FFEBCD',
    },
    credits: {
      enabled: false,
    },
    colors: ['#b0c4de'],
    title: {
      text: 'Avg Complaints',
      align: 'center',
      style: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333',
      },
    },
    xAxis: {
      categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      title: {
        text: 'Days',
        style: {
          fontSize: '14px',
          color: '#6c757d',
        },
      },
      labels: {
        style: {
          fontSize: '12px',
          color: '#333',
        },
      },
    },
    yAxis: {
      title: {
        text: 'Number of Complaints',
        style: {
          fontSize: '14px',
          color: '#6c757d',
        },
      },
      labels: {
        style: {
          fontSize: '12px',
          color: '#333',
        },
      },
      gridLineWidth: 1,
      gridLineColor: '#e9ecef',
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          format: '{y}',
          style: {
            fontSize: '12px',
            color: '#333',
          },
        },
        borderRadius: 5,
        groupPadding: 0.1,
        pointWidth: 30,
        borderWidth: 0,
      },
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      headerFormat: '<b>{point.key}</b><br>',
      pointFormat: 'Complaints: <b>{point.y}</b>',
      style: {
        fontSize: '12px',
        color: '#333',
      },
    },
    series: [
      {
        type: 'column',
        name: 'Complaints',
        data: [
          { name: 'Monday', y: Math.floor(Math.random() * 20) + 1 },
          { name: 'Tuesday', y: Math.floor(Math.random() * 20) + 1 },
          { name: 'Wednesday', y: Math.floor(Math.random() * 20) + 1 },
          { name: 'Thursday', y: Math.floor(Math.random() * 20) + 1 },
          { name: 'Friday', y: Math.floor(Math.random() * 20) + 1 },
        ],
      },
    ],
    accessibility: {
      enabled: false,
    },
  };
}
