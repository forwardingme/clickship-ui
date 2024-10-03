import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { HeaderComponent } from '../components/header.component';
import { FooterComponent } from '../components/footer.component';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CustomerDetails } from '../models/customerDetails';
import { pickupAddressSelector } from '../state/selectors';
import { PickupAddressFormComponent } from '../components/pickup-address-form.component';
import { ParcelActions } from '../state/actions';

@Component({
	selector: 'app-pickup-address',
	standalone: true,
	imports: [
		PickupAddressFormComponent,
		HeaderComponent,
		FooterComponent,
		CommonModule,
	],
	template: `
		<div class="container">
			<app-header title="Pickup Address"></app-header>
			<div class="content">
				<app-pickup-address-form [address]="pickupAddress$ | async" (submitForm)="onSubmit($event)">
				</app-pickup-address-form>
			</div>
			<app-footer></app-footer>
		</div>
	`,
})
export class PickupAddressComponent {
	pickupAddress$: Observable<CustomerDetails | null>;

	private store = inject(Store);
	constructor() {
		this.pickupAddress$ = this.store.select(pickupAddressSelector);
	}

	onSubmit(pickupDetails: CustomerDetails) {
		this.store.dispatch(ParcelActions.savePickupDetails({ pickupDetails }));
	}
}
