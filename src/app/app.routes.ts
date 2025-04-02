import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';
import { ChecklistsComponent } from './components/admin/checklists/checklists.component';
import { AdminHomeComponent } from './components/admin/admin-home/admin-home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      { path: 'view-profile', component: ViewProfileComponent },
      { path: 'checklists', component: ChecklistsComponent },
      { path: 'admin-home', component:AdminHomeComponent}
    ],
  },
];
