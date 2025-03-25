import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';

export const routes: Routes = [
    {path:'', redirectTo:'login', pathMatch:'full'},
    {path:'login', component:LoginComponent},
    {path:'dashboard', component:DashboardLayoutComponent}
];
