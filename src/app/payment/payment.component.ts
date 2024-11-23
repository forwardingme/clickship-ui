import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ParcelActions } from '../state/actions';
import { HeaderComponent } from '../components/header.component';
import { interval, Observable, Subscription } from 'rxjs';
import { RateResponse } from '../models/rateResponse';
import { paymentStepSelector, rateResponseSelector, reviewsSelector, stepNumSelector } from '../state/selectors';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RatingComponent } from '../components/rating.component';
import { Review } from '../models/reviews';

@Component({
	selector: 'app-payment',
	standalone: true,
	imports: [HeaderComponent, RatingComponent, CommonModule, ReactiveFormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="container">
			<app-header [showProgress]="false"></app-header>
			<!-- <div class="page-title">Accept & Pay</div> -->
			<div class="content">
				<div class="row d-flex text-center mt-3 m-auto justify-content-center">
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
								(click)="onAccept()" data-bs-toggle="modal" data-bs-target="#staticBackdrop"
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
						<hr />
						<div class="secure fs-5">Secure your rate!</div>
						<div class="note">
							DHL prices can change every 10 minutes. Finish your
							payment to secure your rate.
						</div>
						<div class="time-lapse fs-2">{{ timeLapse }}</div>
					</div>
					<div class="right col-md-6 col-sm-12">
            <!-- this is the carousel for the reviews-->
            <div id="carouselExampleIndicators" class="carousel carousel-dark slide">
              <div class="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
              </div>
             
              <div class="carousel-inner">
                <div class="carousel-item" *ngFor="let review of (reviews$ | async); let i = index" [ngClass]="{active: i === 0}">
                  <app-rating [rating]="review.rating"></app-rating>
                  <div class="text-center mb-5">
                    <div class="review-comment fs-4">“{{ review.comment }}”</div>
                    <h3>{{ review.author }}</h3>
                    <img class="rounded-circle my-2 avatar" [src]="review.url" alt="avatar">
                  </div>
                </div>
              </div>
            </div>
            <!-- the end of the carousel for the reviews-->

            <!-- here need the number of reviews-->
            <div><h6>12 268+ Happy Clients</h6></div>
            <hr />

            <!-- the end of the carousel for the reviews-->
            <div class="h3 d-flex justify-content-start align-items-center mt-3">
              <img src="assets/images/payment-lock.png" width="50" alt="payment-lock">
              &nbsp;&nbsp;Safe Transaction
            </div>
            <div class="h3 d-flex justify-content-start align-items-center mt-3">
              <img src="assets/images/payment-shield.png" width="50" alt="payment-shield">
              &nbsp;&nbsp;100% Secure Shipment 
            </div>
             <!-- the end of the carousel for the reviews-->
					</div>
				</div>
			</div>
			<div
				class="modal fade"
				id="staticBackdrop"
				data-bs-backdrop="static"
				data-bs-keyboard="false"
				tabindex="-1"
				aria-labelledby="staticBackdropLabel"
				aria-hidden="true"
			>
				<div class="modal-dialog modal-dialog-centered modal-lg">
					<div class="modal-content">
						<div class="modal-header">
							<button
								type="button"
								class="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"
							></button>
						</div>
						<div class="modal-body">
							<div class="content text-center">
								<img
									src="assets/images/credit-card-icon.png"
									width="150"
									alt="credit card icon"
								/>
								<h3 class="w-100 m-auto">
									Please use the payment machine <br />
									located to your right
								</h3>
								<div class="font-16 p-5">
									Kindly attach the first label on the
									shipment <br />and retain the second label
									for your records
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
					</div>
				</div>
			</div>
		</div>
	`,
	styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit, OnDestroy {
	rateResponse$: Observable<RateResponse | null>;
	steps$: Observable<number>;
	paymentStep$: Observable<number>;
	reviews$: Observable<Review[]>;
	timeLapse = '00:00';
	private store = inject(Store);
	private cdr = inject(ChangeDetectorRef);
	private subscription: Subscription = new Subscription();
	// private router = inject(Router);
	constructor(private formBuilder: FormBuilder) {
		this.rateResponse$ = this.store.select(rateResponseSelector);
		this.steps$ = this.store.select(stepNumSelector);
		this.paymentStep$ = this.store.select(paymentStepSelector);
		this.reviews$ = this.store.select(reviewsSelector);
	}

	ngOnInit(): void {
		let seconds = 600;
		this.subscription.add(
			interval(1000).subscribe((_) => {
				seconds--;
				if (seconds < 0) this.subscription.unsubscribe();

				const m = Math.floor(seconds / 60);
				let s = seconds % 60;
				this.timeLapse = `0${m}:${s < 9 ? '0' + s : s}`;
				this.cdr.markForCheck();
			})
		);
	}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe();
	}

	onAccept() {}

	createShipment() {
		console.log('completed');
		this.store.dispatch(ParcelActions.createShipment());
	}
}
