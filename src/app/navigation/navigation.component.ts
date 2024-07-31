import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit {
  currentUrl: string = '';
  isLoggedIn: boolean = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Listen to route changes and update the currentUrl
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.currentUrl = this.router.url;
      this.updateLoginStatus();
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateLoginStatus();
    }
  }

  isActive(url: string): boolean {
    return this.currentUrl.startsWith(url);
  }

  navigateTo(url: string): void {
    this.router.navigate([url]);
  }

  updateLoginStatus(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn = !!sessionStorage.getItem('authToken');
    }
  }

  // Method to handle logout
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('accountId');
      this.isLoggedIn = false;
      this.router.navigate(['/login']); // Redirect to login page
    }
  }
}
