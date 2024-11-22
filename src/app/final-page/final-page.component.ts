import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ParcelActions } from '../state/actions';
// import { stepSelector } from '../state/selectors';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { isValidPickupAddressSelector, parcelTypeSelector } from '../state/selectors';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../components/modal/modal.component';
import { ParcelType } from '../models/shared.models';

@Component({
  selector: 'app-final-page',
  standalone: true,
  imports: [ModalComponent, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="content" >
    <div class="guide-row row d-flex justify-content-around align-item-center" *ngIf="(parcelType$ | async) === 'envelope'">
      <div class="guide-card p-4 col-md-5 col-lg-3 text-center rounded-5">
        <div class="span-number rounded-circle d-flex justify-content-center align-content-center h2">1</div>
        <div class="span-card">
          <h5>Insert your document inside the envelope</h5>
          <img src="/assets/images/envelope_1.jpg" class="w-100"  alt="envelope_1">
        </div>
      </div>
      <div class="guide-card p-4 col-md-5 col-lg-3 text-center rounded-5">
        <div class="span-number rounded-circle d-flex justify-content-center align-content-center h2">2</div>
        <div class="span-card">
          <h5>Remove the seal to protect your documents</h5>
          <img src="/assets/images/envelope_2.jpg" class="w-100"  alt="">
        </div>
      </div>
      <div class="guide-card p-4 col-md-5 col-lg-3 text-center rounded-5">
        <div class="span-number rounded-circle d-flex justify-content-center align-content-center h2">3</div>
        <div class="span-card">
        <h5>Place Shipping Label Inside Shipping Pouch</h5>
        <img src="/assets/images/envelope_3.jpg" class="w-100"  alt="">
        </div>
      </div>
      <div class="guide-card p-4 col-md-5 col-lg-3 text-center rounded-5">
        <div class="span-number rounded-circle d-flex justify-content-center align-content-center h2">4</div>
        <div class="span-card">
          <h5>Remove pouch seal and place pouch on envelope</h5>
          <img src="/assets/images/envelope_4.jpg" class="w-100" alt="envelope_4">
        </div>
      </div>
      <div class="guide-card p-4 col-md-5 col-lg-3 text-center rounded-5">
        <div class="span-number rounded-circle d-flex justify-content-center align-content-center h2">5</div>
        <div class="span-card">
          <h5>Stick the pouch on the envelope</h5>
          <img src="/assets/images/envelope_5.jpg" class="w-100" alt="envelope_5">
        </div>
      </div>
      <div class="guide-card p-4 col-md-5 col-lg-3 text-center rounded-5">
        <div class="span-number rounded-circle d-flex justify-content-center align-content-center h2">6</div>
        <div class="span-card">
        <h5>Give the envelope to the clerk</h5>
        <img src="/assets/images/envelope_6.jpg" class="w-100"  alt="envelope_6">
        </div>
      </div>
    </div>
    <div class="guide-row row d-flex justify-content-around align-item-center" *ngIf="(parcelType$ | async) === 'package'">
      <div class="guide-card p-4 col-md-5 col-lg-3 text-center rounded-5">
        <div class="span-number rounded-circle d-flex justify-content-center align-content-center h2">1</div>
        <div class="span-card">
          <h5>Insert your goods inside the package</h5>
          <img src="/assets/images/package_1.jpg" class="w-100"  alt="package_1">
        </div>
      </div>
      <div class="guide-card p-4 col-md-5 col-lg-3 text-center rounded-5">
        <div class="span-number rounded-circle d-flex justify-content-center align-content-center h2">2</div>
        <div class="span-card">
          <h5>Remove the sticky seal to secure your goods</h5>
          <img src="/assets/images/package_2.jpg" class="w-100"  alt="package_2">
        </div>
      </div>
      <div class="guide-card p-4 col-md-5 col-lg-3 text-center rounded-5">
        <div class="span-number rounded-circle d-flex justify-content-center align-content-center h2">3</div>
        <div class="span-card">
        <h5>Place Shipping Label Inside Shipping Pouch</h5>
        <img src="/assets/images/package_3.jpg" class="w-100"  alt="package_3">
        </div>
      </div>
      <div class="guide-card p-4 col-md-5 col-lg-3 text-center rounded-5">
        <div class="span-number rounded-circle d-flex justify-content-center align-content-center h2">4</div>
        <div class="span-card">
          <h5>Remove the sticky seal to secure the shipping label</h5>
          <img src="/assets/images/package_4.jpg" class="w-100" alt="package_4">
        </div>
      </div>
      <div class="guide-card p-4 col-md-5 col-lg-3 text-center rounded-5">
        <div class="span-number rounded-circle d-flex justify-content-center align-content-center h2">5</div>
        <div class="span-card">
          <h5>Stick the pouch on the envelope</h5>
          <img src="/assets/images/package_5.jpg" class="w-100" alt="package_5">
        </div>
      </div>
      <div class="guide-card p-4 col-md-5 col-lg-3 text-center rounded-5">
        <div class="span-number rounded-circle d-flex justify-content-center align-content-center h2">6</div>
        <div class="span-card">
        <h5>Give the envelope to the clerk</h5>
        <img src="/assets/images/package_6.jpg" class="w-100"  alt="package_6">
        </div>
      </div>
    </div>
    <!-- <app-footer></app-footer> -->
  </div>
  <app-modal title="Machine ID Not Set" [allowClose]="false" *ngIf="!(isValidPickAddress$ | async)">
    <div body>Please contact the owner</div>
    <div footer><button type="button" class="btn btn-secondary" data-bs-dismiss="modal" disabled>Close</button></div>
  </app-modal>
  `,
 styleUrls: ['./final-page.component.scss']
})
export class FinalPageComponent {
  parcelType$: Observable<ParcelType | null>;
  private store = inject(Store);
  private router = inject(Router);
  isValidPickAddress$: Observable<boolean>;
  constructor() {
    this.isValidPickAddress$ = this.store.select(isValidPickupAddressSelector);
    this.parcelType$ = this.store.select(parcelTypeSelector);
  }

}
