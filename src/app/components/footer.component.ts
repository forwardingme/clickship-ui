import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <div class="footer"></div>
  `,
  styles: `
    .footer {
      height: 100px;
      background-color: #ccc;
    }
  `
})
export class FooterComponent {
}
