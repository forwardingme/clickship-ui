import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../components/header.component';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { parcelSelector, rateResponseSelector, isDomesticSelector } from '../state/selectors';
import { RateRequestFormComponent } from '../components/rate-request-form/rate-request-form.component';
import { Parcel } from '../models/parcel';
import { Observable } from 'rxjs';
import { ParcelActions } from '../state/actions';
import { Router } from '@angular/router';
import { RateResponse } from '../models/rateResponse';

@Component({
  selector: 'app-rate-request',
  standalone: true,
  imports: [HeaderComponent, CommonModule, RateRequestFormComponent],
  templateUrl: './rate-request.component.html',
  styleUrls: ['./rate-request.component.scss']
})
export class RateRequestComponent implements OnInit{
  title = 'Get a Shipping Rate';
  parcel$: Observable<Parcel | null>;
  domestic$: Observable<boolean>;
  rateResponse$: Observable<RateResponse | null>;
  private store = inject(Store);
  private router = inject(Router);

  constructor() {
    this.parcel$ = this.store.select(parcelSelector);
    this.domestic$ = this.store.select(isDomesticSelector);
    this.rateResponse$ = this.store.select(rateResponseSelector);
  }

  ngOnInit(): void {
  }

  onSubmit(parcel: Parcel) {
    this.store.dispatch(ParcelActions.rateRequest({ parcel }));
    this.title = 'Shipping Rate';
  }

  onReset() {
    this.store.dispatch(ParcelActions.setRateRequest({ rateResponse: null}));
  }
  createShipment() {
    this.router.navigateByUrl('shipping-details');
  }
}
