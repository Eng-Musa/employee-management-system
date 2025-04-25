import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  MatFormField,
  MatInputModule,
  MatLabel,
} from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { delay } from 'rxjs';
import { constants } from '../../../environments/constants';
import { LocalStorageService } from '../../../services/local-storage.service';
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
  selector: 'app-employees',
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
    RouterModule,
    MatSortModule,
    CommonModule,
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss',
})
export class EmployeesComponent implements OnInit {
  employee: EmployeeList[] = [];
  dataSource = new MatTableDataSource(this.employee);
  searchClicked: boolean = false;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}
  ngOnInit(): void {
    // this.saveEmployees();
    this.fetchEmployees();
  }

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

  loading: boolean = false;
  fetchEmployees(): void {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.employee =
        this.localStorageService.retrieve<any[]>(
          constants.LOCAL_STORAGE_KEY_EMPLOYEES
        ) || [];
      this.dataSource.data = this.employee;
    }, 1000);
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

  openDeleteEmployeeDialog(id: number, name: string, email: string): void {
    const dialogRef = this.dialog.open(DeleteEmployeeDialogueComponent, {
      width: '40vw',
      maxHeight: '90vh',
      height: 'auto',
      data: { id, name, email },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        delay(3000);
        this.fetchEmployees();
      }
    });
  }

  goToEditEmployee(id: number): void {
    this.router.navigate(['dashboard/edit-employee', id]);
  }

  goToEmployeeProfile(id: number, name: string): void {
    this.router.navigate(['dashboard/employee-profile', id, name]);
  }

  //Array of employee objects with all the required fields
  // employeesData = [
  //   {
  //     id: 1,
  //     name: 'John Developer',
  //     email: 'developer@gmail.com',
  //     phoneNumber: '254 763 000 000',
  //     department: 'Product House',
  //     role: 'Developer',
  //     startDate: '2025-04-11',
  //     status: 'Created',
  //     createdDate: new Date()
  //       .toLocaleString('en-US', {
  //         timeZone: 'Africa/Nairobi',
  //       })
  //       .slice(0, 16)
  //       .replace(',', ''),
  //     lastLogin: '',
  //     lastPasswordChange: '',
  //     password: 'Developer@1234',
  //   },
  //   {
  //     id: 2,
  //     name: 'Jane HR',
  //     email: 'hr@gmail.com',
  //     phoneNumber: '254 722 000 000',
  //     department: 'Human Resources',
  //     role: 'HR',
  //     startDate: '2025-04-11',
  //     status: 'Onboarding',
  //     createdDate: new Date()
  //       .toLocaleString('en-US', {
  //         timeZone: 'Africa/Nairobi',
  //       })
  //       .slice(0, 16)
  //       .replace(',', ''),
  //     lastLogin: '',
  //     lastPasswordChange: '',
  //     password: 'Hr@1234',
  //   },
  //   {
  //     id: 3,
  //     name: 'Alice Designer',
  //     email: 'designer@gmail.com',
  //     phoneNumber: '254 763 000 000',
  //     department: 'Design',
  //     role: 'Designer',
  //     startDate: '2025-04-12',
  //     status: 'Created',
  //     createdDate: new Date()
  //       .toLocaleString('en-US', {
  //         timeZone: 'Africa/Nairobi',
  //       })
  //       .slice(0, 16)
  //       .replace(',', ''),
  //     lastLogin: '',
  //     lastPasswordChange: '',
  //     password: 'secure789',
  //   },
  // ];

  // saveEmployees(): void {
  //   if (isPlatformBrowser(this.platformId)) {
  //     localStorage.setItem('employees', JSON.stringify(this.employeesData));
  //   }
  // }
}
