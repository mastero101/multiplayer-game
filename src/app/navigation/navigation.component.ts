import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  currentUrl: string = '';

  constructor(private router: Router) {
    // Listen to route changes and update the currentUrl
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.currentUrl = this.router.url;
    });
  }

  isActive(url: string): boolean {
    return this.currentUrl.startsWith(url);
  }

  navigateTo(url: string): void {
    this.router.navigate([url]);
  }
}
