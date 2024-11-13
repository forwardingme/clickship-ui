import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ParcelActions } from '../state/actions';
import { HeaderComponent } from '../components/header.component';
import { Observable } from 'rxjs';
import { RateResponse } from '../models/rateResponse';
import { paymentStepSelector, rateResponseSelector, stepNumSelector } from '../state/selectors';
import { CommonModule } from '@angular/common';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';

@Component({
	selector: 'app-payment',
	standalone: true,
	imports: [HeaderComponent, CommonModule, ReactiveFormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="container">
			<app-header [showProgress]="false"></app-header>
			<!-- <div class="page-title">Accept & Pay</div> -->
			<div class="content" *ngIf="!accepted">
				<div class="d-flex text-center mt-3 m-auto justify-content-center">
					<div class="left">
						<div class="rate m-auto">
							<div>
								<img
									class="logo_dhl"
									src="assets/images/dhl-log.svg"
								/>
							</div>
							<div class="rate-details">
								<h1>$ {{ (rateResponse$ | async)?.rate }}</h1>
								<p>Estimated Transit Time</p>
								<div class="fs-4">
									{{(rateResponse$ | async)?.estimatedTransitDays}} Days Shipping
								</div>
							</div>
							<!-- <div class="font-12">
              DHL Terms & Conditions apply to all shipmnets. <br />
              EveryShipments may be reweighed by the carrier. <br />
              Delivery dates are estimated and is not guarranteed. <br />
              Shipmnent processed after 3pm will be picked up the next day. <br />
              No pick up on weekends and holidays.
            </div>
            <div class="font-10 d-flex p-3">
              <a href="">DHL Terms & Conditions</a>
            </div> -->
						</div>

						<div class="text-center col-12 p-3">
							<button
								type="button"
								class="btn btn-danger btn-lg button"
								(click)="onSubmit()"
							>
								Accept & Pay
							</button>
						</div>

						<div class="payment-methods">
							<img
								src="assets/images/payment-methods.png"
								alt="Payment Methods"
							/>
						</div>
						<div class="secure fs-5">Secure your rate!</div>
						<div class="note">
							DHL prices can change every 10 minutes. Finish your
							payment to secure your rate.
						</div>
						<div class="time-lapse fs-2">09:53</div>
					</div>
					<div class="right">
						
					</div>
				</div>
			</div>
			<div class="content text-center" *ngIf="accepted">
				<h3 class="m-auto">
					Please use the card machine <br />
					located to your right
				</h3>
				<div class="font-12 p-5">
					Kindly attach the first label on the shipment <br />and
					retain the second label for your records
				</div>
				<div class="text-center col-12 p-3">
					<button
						type="submit"
						class="btn btn-danger btn-lg"
						(click)="createShipment()"
					>
						Complete
					</button>
				</div>
			</div>
		</div>
	`,
	styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent {
	rateResponse$: Observable<RateResponse | null>;
	steps$: Observable<number>;
  paymentStep$: Observable<number>;
	accepted = false;
	private store = inject(Store);
	// private router = inject(Router);
	constructor(private formBuilder: FormBuilder) {
		this.rateResponse$ = this.store.select(rateResponseSelector);
		this.steps$ = this.store.select(stepNumSelector);
    this.paymentStep$ = this.store.select(paymentStepSelector);
	}

	onSubmit() {
		this.accepted = true;
	}

	createShipment() {
		console.log('completed');
		this.store.dispatch(ParcelActions.createShipment());
	}
}
