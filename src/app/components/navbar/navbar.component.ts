import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private router = inject(Router);
  constructor() {}

  goHome() {
    this.router.navigateByUrl('');
  }

  logout() {
    console.log('logout');
  }
}
