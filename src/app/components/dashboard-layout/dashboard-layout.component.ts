import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import {
  MatFormField,
  MatInputModule,
  MatLabel,
} from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ChangePassComponent } from '../auth/change-pass/change-pass.component';

interface Notification {
  id: number;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

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
    MatToolbarModule,
    CommonModule,
    MatSidenavModule,
    MatExpansionModule,
    MatMenuModule,
    MatListModule,
    MatDividerModule,
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss',
})
export class DashboardLayoutComponent implements OnInit {
  isExpanded = true;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Check the window width if running in the browser
      if (window.innerWidth < 568) {
        this.isExpanded = false;
      }
    }
  }

  logout() {
    this.authService.logout();
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  isAdmin(): boolean {
    return this.authService.getUserType() === 'admin';
  }

  toggleSidenav() {
    this.isExpanded = !this.isExpanded;
  }

  // HostListener to detect clicks anywhere in the document
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (isPlatformBrowser(this.platformId)) {
      const sidenav = document.querySelector('.sidenav'); // Adjust the selector to your sidenav element
      if (
        sidenav &&
        !sidenav.contains(event.target as Node) &&
        window.innerWidth < 568
      ) {
        this.isExpanded = false; // Collapse sidenav if click is outside
      }
    }
  }

  // HostListener to detect window resizing
  @HostListener('window:resize', ['$event'])
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      const windowWidth = window.innerWidth;
      if (windowWidth < 568) {
        this.isExpanded = false;
      } else {
        this.isExpanded = true;
      }
    }
  }

  goHome() {
    if (this.isAdmin()) {
      this.router.navigate(['dashboard/admin-home']);
    } else if (!this.isAdmin()) {
      this.router.navigate(['dashboard/home']);
    }
  }

  goToChecklists() {
    if (this.isAdmin()) {
      this.router.navigate(['dashboard/checklists']);
    }
  }

  goToViewProfile(): void {
    this.router.navigate(['dashboard/view-profile']);
  }

  openAddChangePassDialog(): void {
    this.dialog.open(ChangePassComponent, {
      width: '350px',
      height: 'auto',
      maxHeight: '90vh',
    });
  }

  notifications: Notification[] = [
    {
      id: 1,
      title: 'Deadline Reminder',
      message: 'Auth deadline soon. Push commits.',
      timestamp: new Date(),
      read: false,
    },
    {
      id: 2,
      title: 'System Update',
      message: 'Maintenance on Fri at 10 PM. Sync branches.',
      timestamp: new Date(),
      read: false,
    },
    {
      id: 3,
      title: 'New PR',
      message: 'New PR awaits review for perf enhancements.',
      timestamp: new Date(),
      read: false,
    },
  ];

  markAsRead(notificationId: number): void {
    this.notifications = this.notifications.filter(
      (notification) => notification.id !== notificationId
    );
  }
}
