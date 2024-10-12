import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ParcelActions } from '../state/actions';
import { ParcelType } from '../models/shared.models';
import { HeaderComponent } from '../components/header.component';
import { FooterComponent } from "../components/footer.component";
import { IconsComponent } from '../components/icons.component';

@Component({
  selector: 'app-shipment-type',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, IconsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="container">
    <app-header title="Select Shipping Type"></app-header>
    <div class="d-flex flex-wrap align-items-center justify-content-center flex-fill">
      <div class="d-flex justify-content-center py-2 gap-5">
        <div class="selection p-4" title="Envolope" (click)="setShipmentType(ParcelType.ENVELOPE)">
          <img class="logo_envolope" src="assets/images/envelope.svg" alt="Envelope" />
          <div class="text-center fs-3">Envelope</div>
        </div>
        <div class="selection p-4" title="package" (click)="setShipmentType(ParcelType.PACKAGE)">
          <img class="logo_package" src="assets/images/box.svg" alt="Package" />
          <div class="text-center fs-3">Package</div>
        </div>
      </div>
      <app-icons></app-icons>
    </div>
    <app-footer></app-footer>
  </div>
  `,
  styleUrls: ['./shipment-type.component.scss']
})
export class ShipmentTypeComponent {
  ParcelType = ParcelType;
  private store = inject(Store);
  private router = inject(Router);
  constructor() {}

  setShipmentType(parcelType: ParcelType) {
    this.store.dispatch(ParcelActions.setParcelType({ parcelType }));
    this.router.navigateByUrl('destination');
  }
}
