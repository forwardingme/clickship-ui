import { NgIf, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ModalComponent, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
        <a class="me-2" (click)="toggleInfo()">
          <img src="assets/images/info.svg" alt="Infomation" />
        </a>
        <a class="me-2" *ngIf="showClose" (click)="exit()">
          <img src="assets/images/x.svg" alt="Close" />
        </a>
      </div>
    </header>
    <app-modal title="Technical Support" class="text-center" [allowClose]="false" *ngIf="showInfo">
      <div body>
        <div>Technical Support</div>
        <h3>1-855-974-9742</h3>
        <div>Customer Service</div>
        <h3>Email: ABCD&#64;GMAIL.COM</h3>
      </div>
      <div class="text-center w-100" footer>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" (click)="toggleInfo()">Close</button>
      </div>
    </app-modal>
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
  @Output() close = new EventEmitter();
  @Output() goback = new EventEmitter();
  showInfo = false;
  private location = inject(Location);

  constructor() {}

  goBack() {
    this.location.back();
    this.goback.emit();
  }

  toggleInfo() {
    this.showInfo = !this.showInfo;
  }

  exit() {
    this.close.emit();
  }
}
