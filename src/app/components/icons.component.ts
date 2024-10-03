import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-icons',
  standalone: true,
  imports: [],
  template: `
    <div class="icons"></div>
  `,
  styles: `
    :host {
      width: 100%;
    }
    .icons {
      height: 150px;
      width: 100%;
      background-color: #eee;
    }
  `
})
export class IconsComponent {
}
