import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AlertService } from '../../services/alert.service';

export interface LoggedInPerson {
  name: string;
  email: string;
  password: string;
  createdDate: string;
  role: string;
  phoneNumber: string;
  lastLogin: string;
  lastPasswordChange: string;
}

@Component({
  selector: 'app-view-profile',
  imports: [],
  templateUrl: './view-profile.component.html',
  styleUrl: './view-profile.component.scss',
})
export class ViewProfileComponent implements OnInit {
  loggedInPerson: LoggedInPerson = {
    name: 'Unknown',
    email: 'Unknown',
    password: 'Unknown',
    createdDate: 'Unknown',
    role: 'Unknown',
    phoneNumber: 'Unknown',
    lastLogin: 'Unknown',
    lastPasswordChange: 'Unknown'
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.getLoggedInPerson();
  }

  getLoggedInPerson() {
    if (isPlatformBrowser(this.platformId)) {
      const storedUserStr = localStorage.getItem('adminUser');
      if (storedUserStr) {
        this.loggedInPerson = JSON.parse(storedUserStr) as LoggedInPerson;
      } else {
        this.alertService.showErrorToastr('No user found in localStorage.');
      }
    }
  }
}
