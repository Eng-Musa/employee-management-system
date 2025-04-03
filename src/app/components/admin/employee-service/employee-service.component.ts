import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { delay } from 'rxjs';
import { AlertService } from '../../../services/alert.service';
import { MatMenuModule } from '@angular/material/menu';
import { AddEmployeeDialogueComponent } from '../add-employee-dialogue/add-employee-dialogue.component';
import { DeleteEmployeeDialogueComponent } from '../delete-employee-dialogue/delete-employee-dialogue.component';

interface EmployeeList {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  department: string;
  role: string;
  startDate: string;
  status: string;
}

@Component({
  selector: 'app-employee-service',
  imports: [
    MatFormField,
    MatIconModule,
    MatLabel,
    MatProgressBarModule,
    MatMenuModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    RouterModule
  ],
  templateUrl: './employee-service.component.html',
  styleUrl: './employee-service.component.scss',
})
export class EmployeeServiceComponent {
  employee: EmployeeList[] = [];
  dataSource = new MatTableDataSource(this.employee);
  searchClicked: boolean = false;

  constructor(private dialog: MatDialog, private router: Router){}

  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: EventTarget | null): void {
    if (filterValue instanceof HTMLInputElement) {
      this.dataSource.filter = filterValue.value.trim().toLowerCase();
    }
  }


  loading = false;
  fetchEmployees(): void {
   
  }

  openAddEmployeeDialog(): void {
    const dialogRef = this.dialog.open(AddEmployeeDialogueComponent, {
      width: 'auto',
      maxWidth: '90vw',
      height: 'auto',
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        delay(3000);
        this.fetchEmployees();
      }
    });
  }

  openDeleteEmployeeDialog(id: number): void {
    const dialogRef = this.dialog.open(DeleteEmployeeDialogueComponent, {
      width: '40vw',
      maxHeight: '90vh',
      height: 'auto',
      data: { id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        delay(3000);
        this.fetchEmployees();
      }
    });
  }

  goToEditTenant(id: number): void {
    this.router.navigate(['dashboard/edit-tenant', id]);
  }
}
