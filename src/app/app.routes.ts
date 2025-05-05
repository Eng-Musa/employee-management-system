import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';
import { ChecklistsComponent } from './components/admin/checklists/checklists.component';
import { AdminHomeComponent } from './components/admin/admin-home/admin-home.component';
import { ViewEmployeeComponent } from './components/admin/view-employee/view-employee.component';
import { authGuard } from './guards/auth.guard';
import { childrenAuthGuard } from './guards/children-auth.guard';
import { HomeComponent } from './components/employees/home/home.component';
import { EditEmployeeComponent } from './components/admin/edit-employee/edit-employee.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [childrenAuthGuard],
    children: [
      { path: 'view-profile', component: ViewProfileComponent },
      { path: 'checklists', component: ChecklistsComponent },
      { path: 'admin-home', component:AdminHomeComponent},
      {path: 'employee-profile/:id/:name', component: ViewEmployeeComponent},
      {path: 'home', component:HomeComponent},
      {path: 'edit-employee/:email', component: EditEmployeeComponent}
    ],
  },
];
