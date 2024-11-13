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
				<div class="row d-flex text-center mt-3 m-auto justify-content-around">
					<div class="left col-md-6 col-sm-12">
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
					<div class="right col-md-6 col-sm-12">
            <div id="carouselExampleIndicators" class="carousel carousel-dark slide">
              <div class="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
              </div>
              <div class="carousel-inner">
                <div class="carousel-item active">
                  <div class="star-group d-flex justify-content-around">
                    <img src="assets/images/star-fill.svg">
                    <img src="assets/images/star-fill.svg">
                    <img src="assets/images/star-fill.svg">
                    <img src="assets/images/star-half.svg">
                    <img src="assets/images/star.svg">
                  </div>
                  <div class="text-center mb-5">
                    <h4>“Klickship quick to Haiti, no issues”</h4>
                    <br>
                    <h3>Junior Augustin</h3>
                    <img class="rounded-circle my-2" src="assets/images/avatar.png" width="150" alt="avatar">
                  </div>
                </div>
                <div class="carousel-item">
                <div class="star-group d-flex justify-content-around">
                    <img src="assets/images/star-fill.svg">
                    <img src="assets/images/star-fill.svg">
                    <img src="assets/images/star-fill.svg">
                    <img src="assets/images/star-fill.svg">
                    <img src="assets/images/star-half.svg">
                  </div>
                  <div class="text-center mb-5">
                    <h4>“Klickship quick to Haiti, no issues”</h4>
                    <br>
                    <h3>Junior Augustin</h3>
                    <img class="rounded-circle my-2" src="assets/images/avatar.png" width="150" alt="avatar">
                  </div>
                </div>
                <div class="carousel-item">
                  <div class="star-group d-flex justify-content-around">
                    <img src="assets/images/star-fill.svg">
                    <img src="assets/images/star-fill.svg">
                    <img src="assets/images/star-fill.svg">
                    <img src="assets/images/star-fill.svg">
                    <img src="assets/images/star-fill.svg">
                  </div>
                  <div class="text-center mb-5">
                    <h4>“Klickship quick to Haiti, no issues”</h4>
                    <br>
                    <h3>Junior Augustin</h3>
                    <img class="rounded-circle my-2" src="assets/images/avatar.png" width="150" alt="avatar">
                  </div>
                </div>
              </div>
            </div>
            <div><h6>12 268+ Happy Clients</h6></div>
            <hr>
            <div class="h3 d-flex justify-content-start align-items-center">
              <img src="assets/images/payment-lock.png" width="50" alt="payment-lock">
              &nbsp;&nbsp;Safe Transaction
            
            </div>
            <div class="h3 d-flex justify-content-start align-items-center">
              <img src="assets/images/payment-shield.png" width="50" alt="payment-shield">
              &nbsp;&nbsp;100% Secure Shipment 
            </div>
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
