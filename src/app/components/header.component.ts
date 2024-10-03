import { NgIf, Location } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf],
  template: `
    <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4">
      <div class="col-md-3 mb-2 mb-md-0">
        <a *ngIf="showPrev" class="d-inline-flex link-body-emphasis text-decoration-none" (click)="goBack()">
          <img src="assets/images/arrow-left.svg" alt="Back" />
        </a>
      </div>

      <div class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0 title">
        {{title}}
      </div>

      <div class="col-md-3 text-end">
        <a class="me-2" (click)="openInfo()">
          <img src="assets/images/info.svg" alt="Infomation" />
        </a>
        <a class="me-2" *ngIf="showClose" (click)="close()">
          <img src="assets/images/x.svg" alt="Close" />
        </a>
      </div>
    </header>
  `,
  styles: `
    .title {
      font-size: 2.5rem;
      color: var(--bs-gray-600);
    }
    a {
      opacity: 0.6;
      cursor: pointer;

      img {
        width: 30px;
      }
    }
  `
})
export class HeaderComponent {
  @Input() title = '';
  @Input() showClose = false;
  @Input() showPrev = true;
  @Output() cloase = new EventEmitter();
  private location = inject(Location);

  constructor() {}

  goBack() {
    this.location.back();
  }

  openInfo() {
    console.log('info');
  }

  close() {
    this.cloase.emit();
  }
}
