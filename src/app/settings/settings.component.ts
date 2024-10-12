import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CustomerDetails } from '../models/customerDetails';
import { pickupAddressSelector } from '../state/selectors';
import { PickupAddressFormComponent } from '../components/pickup-address-form.component';
import { ParcelActions } from '../state/actions';
import { NavbarComponent } from '../components/navbar/navbar.component';

@Component({
	selector: 'app-pickup-address',
	standalone: true,
	imports: [
		PickupAddressFormComponent,
		NavbarComponent,
		// FooterComponent,
		CommonModule,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './settings.component.html',
})
export class SettingsComponent {
	pickupAddress$: Observable<CustomerDetails | null>;
	accordion = [true, false];

	private store = inject(Store);
	constructor() {
		this.pickupAddress$ = this.store.select(pickupAddressSelector);
	}

	onSubmit(pickupDetails: CustomerDetails) {
		// this.store.dispatch(ParcelActions.savePickupDetails({ pickupDetails }));
	}

	onSearch(id: string) {
		this.store.dispatch(ParcelActions.seachMachine({ id }));
	}

	toggle(idx: number) {
		this.accordion = this.accordion.map((v, i) => {
			if (i === idx) return !v;
			return false;
		})
	}
}
