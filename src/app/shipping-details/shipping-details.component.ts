import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../components/header.component';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { isDomesticSelector, parcelSelector } from '../state/selectors';
import { Parcel } from '../models/parcel';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { ShipperDetailsFormComponent } from '../components/shipping-details-form/shipping-details-form.component';
import { ParcelActions } from '../state/actions';

@Component({
  selector: 'app-rate-request',
  standalone: true,
  imports: [HeaderComponent, CommonModule, ShipperDetailsFormComponent],
  templateUrl: './shipping-details.component.html',
  styleUrls: ['./shipping-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingDetailsComponent implements OnInit{
  parcel$: Observable<Parcel | null>;
  domestic$: Observable<boolean>;

  private store = inject(Store);
  private router = inject(Router);

  constructor() {
    this.parcel$ = this.store.select(parcelSelector);
    this.domestic$ = this.store.select(isDomesticSelector);
  }

  ngOnInit(): void {
  }

  onSubmit(parcel: Parcel) {
    this.store.dispatch(ParcelActions.confirmDetails({ parcel }));
    this.router.navigateByUrl('payment');
  }
}
