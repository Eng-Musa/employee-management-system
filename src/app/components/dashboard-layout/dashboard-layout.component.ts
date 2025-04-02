import {
  Component,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import {
  MatFormField,
  MatInputModule,
  MatLabel,
} from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { ChangePassComponent } from '../auth/change-pass/change-pass.component';
import { MatDialog } from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';


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
    MatDividerModule
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss',
})
export class DashboardLayoutComponent implements OnInit {
  userType: string | null = null;
  isExpanded: boolean = true;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Check the window width if running in the browser
      if (window.innerWidth < 568) {
        this.isExpanded = false;
      }

      // Use localStorage safely after ensuring we're in the browser
      const storedUserStr = localStorage.getItem('adminUser');
      if (storedUserStr !== null) {
        const storedUser = JSON.parse(storedUserStr);
        this.userType = storedUser.role;
        console.log(this.userType);
      }
    }
  }

  logout() {
    this.router.navigate(['/login']);
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  isAdmin(): boolean {
    return this.userType === 'admin';
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
  onResize(event: Event) {
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
      this.router.navigate(['dashboard']);
    }
    // } else if (this.isAdmin()) {
    //   this.router.navigate(['dashboard/landlord-home']);
    // }
  }

  goToChecklists(){
    if (this.isAdmin()) {
      this.router.navigate(['dashboard/checklists']);
    }
  }

  goToViewProfile(): void {
    this.router.navigate(['dashboard/view-profile']);
  }

  openAddChangePassDialog(): void {
    const dialogRef = this.dialog.open(ChangePassComponent, {
      width: '350px',
      height: 'auto',
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }
  
  notifications: Notification[] = [
    {
      id: 1,
      title: 'New Message',
      message: 'You have received a new message from John',
      timestamp: new Date(),
      read: false
    },
    {
      id: 2,
      title: 'System Update',
      message: 'Scheduled maintenance on Friday at 10 PM',
      timestamp: new Date(),
      read: false
    }
    // Add more notifications as needed
  ];

  markAsRead(notificationId: number): void {
    this.notifications = this.notifications.filter(
      notification => notification.id !== notificationId
    );
  }
}
