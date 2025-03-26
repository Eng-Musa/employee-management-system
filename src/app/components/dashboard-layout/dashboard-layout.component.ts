import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import {
  MatFormField,
  MatInputModule,
  MatLabel,
} from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatFormField,
    MatLabel,
    MatInputModule,
    RouterModule,
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss',
})
export class DashboardLayoutComponent {
  constructor(private router: Router) {}

  logout() {this.router.navigate(['/login'])}
}
