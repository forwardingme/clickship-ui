import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ParcelActions } from '../state/actions';
import { HeaderComponent } from '../components/header.component';
import { FooterComponent } from "../components/footer.component";
import { Observable } from 'rxjs';
import { RateResponse } from '../models/rateResponse';
import { rateResponseSelector } from '../state/selectors';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <app-header title="Accept & Pay" [showClose]="accepted"></app-header>
      <div class="content text-center" *ngIf="!accepted">
        <div class="rate col-md-4 m-auto">
          <div class="title">Payment</div>
          <div>
            <img class="logo_dhl" src="assets/images/dhl-log.svg" />
          </div>
          <div class="rate-details">
            <h1> $ {{ (rateResponse$ | async)?.rate }}</h1>
            <p>Estimated Transit Time</p>
            <h5>{{ (rateResponse$ | async)?.estimatedTransitDays }} days</h5>
          </div>
          <div class="font-12">
            DHL Terms & Conditions apply to all shipmnets. <br />
            EveryShipments may be reweighed by the carrier. <br />
            Delivery dates are estimated and is not guarranteed. <br />
            Shipmnent processed after 3pm will be picked up the next day. <br />
            No pick up on weekends and holidays.
          </div>
          <div class="font-10 d-flex p-3">
            <a href="">DHL Terms & Conditions</a>
          </div>
        </div>
        <form class="row col-md-4 m-auto" [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="flexCheckDefault" formControlName="accept">
            <label class="form-check-label" for="flexCheckDefault">
              I confirm I have read and understood the DHL Terms & Conditions.
            </label>
          </div>
          <div class="text-center col-12 p-3">
            <button
              type="submit"
              class="btn btn-danger btn-lg "
              [disabled]="!form.valid"
            >
              Accept & Pay
            </button>
          </div>
        </form>
      </div>
      <div class="content text-center" *ngIf="accepted">
        <h3 class="m-auto">Please use the card machine <br /> located to your right</h3>
        <div class="font-12 p-5">Kindly attach the first label on the shipment <br />and retain the second label for your records</div>
        <div class="text-center col-12 p-3">
            <button type="submit" class="btn btn-danger btn-lg" (click)="createShipment()">
              Complete
            </button>
          </div>
      </div>
    </div>
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            ...
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {
  rateResponse$: Observable<RateResponse | null>;
  accepted = false;
  form: FormGroup;
  private store = inject(Store);
  private router = inject(Router);
  constructor(private formBuilder: FormBuilder) {
    this.rateResponse$ = this.store.select(rateResponseSelector);
    this.form = formBuilder.group({
      accept: new FormControl('', Validators.requiredTrue)
    });
  }

  onSubmit() {
    this.accepted = this.form.value.accept;
  }

  createShipment() {
    console.log('completed')
    this.store.dispatch(ParcelActions.createShipment());
  }
}
