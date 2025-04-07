import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-employee',
  imports: [],
  templateUrl: './view-employee.component.html',
  styleUrl: './view-employee.component.scss'
})
export class ViewEmployeeComponent implements OnInit {

  employeeId!: number;
  employeeName: string = '';

  constructor(private route: ActivatedRoute){
    
  }
  ngOnInit(): void {
     // Retrieve the id from the route parameters
     this.route.params.subscribe((params) => {
      this.employeeId = +params['id']; // Convert to number
      this.employeeName = params['name']; // Retrieve apartment name
      console.log('Employee ID:', this.employeeId);
      console.log('Employee Name:', this.employeeName);
    });
  }

}
