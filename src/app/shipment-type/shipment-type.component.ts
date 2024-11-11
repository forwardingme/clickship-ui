import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ParcelActions } from '../state/actions';
import { ParcelType } from '../models/shared.models';
import { HeaderComponent } from '../components/header.component';
import { IconsComponent } from '../components/icons.component';

@Component({
  selector: 'app-shipment-type',
  standalone: true,
  imports: [HeaderComponent, IconsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="container">
    <app-header [showProgress]="false"></app-header>
    <div class="page-title">Select Type</div>
    <div class="d-flex flex-wrap align-items-center justify-content-center flex-fill">
      <div class="d-flex justify-content-center py-2 gap-5">
        <div class="selection p-4" title="Envolope" (click)="setShipmentType(ParcelType.ENVELOPE)">
          <img class="logo_envolope big-img" src="assets/images/envelope.svg" alt="Envelope" />
          <div class="text-center"><button class="button">ENVELOPE</button><div class="fs-6">(Documents Only)</div></div>
        </div>
        <div class="vertical-line"></div>
        <div class="selection p-4" title="package" (click)="setShipmentType(ParcelType.PACKAGE)">
          <img class="logo_package big-img" src="assets/images/box.svg" alt="Package" />
          <div class="text-center"><button class="button">PACKAGE</button></div>
        </div>
      </div>
      <app-icons></app-icons>
    </div>
    
    <!-- <div class="row d-flex justify-content-center">
      <div class="selection p-2 col-sm-5 d-flex justify-content-center align-items-center" title="Envolope" (click)="setShipmentType(ParcelType.ENVELOPE)">
        <div>
          <img class="logo_envolope big-img" src="assets/images/envelope.svg" alt="Envelope" />
          <div class="d-flex justify-content-center p-2"><button class="button">ENVELOPE</button></div>
        </div>
      </div>
      <div class="vertical-line"></div>
      <div class="selection p-2 col-sm-5 d-flex justify-content-center align-items-center" title="package" (click)="setShipmentType(ParcelType.PACKAGE)">
        <div >
        <img class="logo_package big-img" src="assets/images/box.svg" alt="Package" />
        <div class="d-flex justify-content-center p-2"><button class="button">PACKAGE</button></div>
        </div>
      </div>
      
    </div> -->
    <!-- <app-icons></app-icons> -->
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
