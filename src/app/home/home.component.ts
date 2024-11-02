import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ParcelActions } from '../state/actions';
// import { stepSelector } from '../state/selectors';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { isValidPickupAddressSelector } from '../state/selectors';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../components/modal/modal.component';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [ModalComponent, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="container text-center">
    <div class="header">
      <img class="top_img"
      src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
    </div>
    <div class="content">
      <div>
        <img class="logo_dhl"
          src="assets/images/dhl-log.svg" />
      </div>
      <div class="content">
        <div>L'excellence. Simplement livrée</div>
        <div>Excellence. Simply Delivered</div>
      </div>
      <div class="actions">
        <button class="button" (click)="selectLang('en')">
          <span class="text">English</span>
        </button>
        <button class="button" (click)="selectLang('fr')">
          <span class="text">Frainçais</span>
        </button>
      </div>
    </div>
    <!-- <app-footer></app-footer> -->
  </div>
  <app-modal title="Machine ID Not Set" [allowClose]="false" *ngIf="!(isValidPickAddress$ | async)">
    <div body>Please contact the owner</div>
    <div footer><button type="button" class="btn btn-secondary" data-bs-dismiss="modal" disabled>Close</button></div>
  </app-modal>
  `,
 styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private store = inject(Store);
  private router = inject(Router);
  isValidPickAddress$: Observable<boolean>;
  constructor() {
    this.isValidPickAddress$ = this.store.select(isValidPickupAddressSelector);
  }

  selectLang(language: string) {
    this.store.dispatch(ParcelActions.setLanguage({language}));
    this.router.navigateByUrl('shipment-type');
  }
}
