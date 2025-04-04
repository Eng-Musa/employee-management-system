import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { RouterModule } from '@angular/router';
import { EmployeesComponent } from "../employees/employees.component";

@Component({
  selector: 'app-admin-home',
  imports: [HighchartsChartModule, RouterModule, EmployeesComponent],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.scss',
})
export class AdminHomeComponent implements OnInit {
  completed: number = 85;
  incomplete: number = 15;
  updateFlag: boolean = false;

  ngOnInit(): void {}

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isHighcharts = isPlatformBrowser(this.platformId);
  }
  isHighcharts = false;
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
          <span style="font-size: 14px; font-weight: bold; color: #000;">608</span>
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
          { name: 'Completed', y: this.completed, color: '#28a745' },
          { name: 'Incomplete', y: this.incomplete, color: '#dc3545' },
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
      text: 'Employees By department',
      align: 'center',
      style: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333',
      },
    },
    xAxis: {
      categories: ['Mobile', 'iOS', 'Angular', 'IT', '.NET'],
      title: {
        text: 'Departments',
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
        text: 'Number of Employees',
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
      pointFormat: 'Department: <b>{point.y}</b>',
      style: {
        fontSize: '12px',
        color: '#333',
      },
    },
    series: [
      {
        type: 'column',
        name: 'Department',
        data: [
          { name: 'Mobile', y: Math.floor(Math.random() * 50) + 50 },
          { name: 'iOS', y: Math.floor(Math.random() * 50) + 50 },
          { name: 'Angular', y: Math.floor(Math.random() * 50) + 50 },
          { name: 'IT', y: Math.floor(Math.random() * 50) + 50 },
          { name: '.NET', y: Math.floor(Math.random() * 50) + 50 },
        ],
      },
    ],
    accessibility: {
      enabled: false,
    },
  };
}
