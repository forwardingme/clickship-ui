import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../components/header.component';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { parcelSelector, rateResponseSelector, addressbooksSelector, shipperAddressbooksSelector, destinationSelector, stepNumSelector } from '../state/selectors';
import { RateRequestFormComponent } from '../components/rate-request-form/rate-request-form.component';
import { RateBoxComponent } from '../components/rate-box.component';
import { Parcel } from '../models/parcel';
import { Observable } from 'rxjs';
import { ParcelActions } from '../state/actions';
import { Router } from '@angular/router';
import { RateResponse } from '../models/rateResponse';
import { AddressBook, AddressSearchRequest, DestinationEnum } from '../models/shared.models';

@Component({
  selector: 'app-rate-request',
  standalone: true,
  imports: [HeaderComponent, RateBoxComponent, CommonModule, RateRequestFormComponent],
  templateUrl: './rate-request.component.html',
  // styleUrls: ['./rate-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RateRequestComponent implements OnInit{
  parcel$: Observable<Parcel | null>;
  destination$: Observable<DestinationEnum>;
  rateResponse$: Observable<RateResponse | null>;
  addressbooks$: Observable<AddressBook[]>;
  shipperAddressbooks$: Observable<AddressBook[]>;
  steps$: Observable<number>;
  private store = inject(Store);
  private router = inject(Router);

  constructor() {
    this.parcel$ = this.store.select(parcelSelector);
    this.destination$ = this.store.select(destinationSelector);
    this.rateResponse$ = this.store.select(rateResponseSelector);
    this.addressbooks$ = this.store.select(addressbooksSelector);
    this.shipperAddressbooks$ = this.store.select(shipperAddressbooksSelector);
    this.steps$ = this.store.select(stepNumSelector);
  }

  ngOnInit(): void {
  }

  goback() {
    this.store.dispatch(ParcelActions.reset());
  }
  onSubmit(parcel: Parcel) {
    this.store.dispatch(ParcelActions.rateRequest({ parcel }));
  }

  onReset() {
    this.store.dispatch(ParcelActions.setRateRequest({ rateResponse: null}));
  }
  createShipment() {
    this.router.navigateByUrl('shipping-details');
  }
  onAddressChange(request: AddressSearchRequest) {
    this.store.dispatch(ParcelActions.addressSearch({ request }));
  }
  onCountryChange() {
    this.store.dispatch(ParcelActions.setAddressBooks({addressBooks: []}));
  }
}
