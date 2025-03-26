import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';

@Component({
  selector: 'app-dashboard-layout',
  imports: [MatIconModule, MatButtonModule, MatBadgeModule, MatFormField, MatLabel,MatInputModule],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss'
})
export class DashboardLayoutComponent {

}
