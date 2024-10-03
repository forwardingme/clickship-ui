import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { CustomerDetails } from '../models/customerDetails';
import { isValidPickupAddress } from '../state/selectors';
import { NgIf } from '@angular/common';

@Component({
	selector: 'app-pickup-address-form',
	standalone: true,
	imports: [
    NgIf,
		ReactiveFormsModule,
	],
	template: `
    <form
      class="row col-md-8 mx-auto"
      [formGroup]="form"
      (ngSubmit)="onSubmit()"
    >
      <div class="row g-3">
        <div class="col-12">
          <input
            class="form-control"
            type="text"
            formControlName="fullName"
            placeholder="Customer Name"
            aria-label="Customer Name"
            required
          />
        </div>
        <div class="col-12">
          <input
            class="form-control"
            type="text"
            formControlName="companyName"
            placeholder="Company Name"
            aria-label="Company Name"
          />
        </div>
        <div class="col-12">
          <input
            class="form-control"
            type="text"
            formControlName="addressLine1"
            placeholder="Address Line 1"
            aria-label="Address Line 1"
            required
          />
        </div>
        <div class="col-12">
          <input
            class="form-control"
            type="text"
            formControlName="addressLine2"
            placeholder="Address Line 2"
            aria-label="Address Line 2"
          />
        </div>
        <div class="col-md-6">
          <input
            class="form-control"
            type="text"
            formControlName="cityName"
            placeholder="City"
            aria-label="City"
            maxlength="45"
            required
          />
        </div>
        <div class="col-md-6">
          <input
            class="form-control"
            type="text"
            formControlName="provinceCode"
            placeholder="Province"
            aria-label="Province"
            maxlength="35"
          />
        </div>
        <div class="col-6">
          <input
            class="form-control"
            type="text"
            formControlName="postalCode"
            placeholder="Postal Code"
            aria-label="Postal Code"
            pattern="[a-z][0-9][a-z][0-9][a-z][0-9]$"
            maxlength="6"
            required
          />
        </div>
        <div class="col-md-6">
          <select
            formControlName="countryCode"
            class="form-select"
            required
          >
            <option value="CA">Canada</option>
          </select>
        </div>
        <div class="col-12">
          <input
            class="form-control"
            type="text"
            formControlName="phone"
            placeholder="Phone"
            aria-label="Phone"
            pattern="^[0-9]*$"
            required
          />
        </div>
        <div class="col-12">
          <input
            class="form-control"
            type="text"
            formControlName="email"
            placeholder="Email"
            aria-label="Email"
          />
        </div>
      </div>
      <div class="text-center col-12 p-3">
        <button *ngIf="readonly" type="button" class="btn btn-danger btn-lg" (click)="changeMode()">
          Edit
        </button>
        <button
          *ngIf="!readonly"
          type="submit"
          class="btn btn-danger btn-lg"
          [disabled]="!form.valid"
        >
          Save
        </button>
      </div>
    </form>
	`,
})
export class PickupAddressFormComponent {
	form: FormGroup;
  readonly = false;
  @Input()
	set address(data: CustomerDetails | null) {
		if (!!data) {
			this.form.patchValue(data);
      this.readonly = isValidPickupAddress(data);
      if (this.readonly) {
        this.form.disable();
      }
		}
	}
  @Output() submitForm = new EventEmitter<CustomerDetails>();
	private formBuilder = inject(FormBuilder);
	constructor() {
		this.form = this.formBuilder.group({
			fullName: new FormControl('', [
				Validators.required,
				Validators.maxLength(70),
			]),
			companyName: new FormControl('', [Validators.maxLength(70)]),
			phone: new FormControl('', [
				Validators.required,
				Validators.maxLength(10),
			]),
			email: new FormControl('', [Validators.maxLength(70)]),
			addressLine1: new FormControl('', [
				Validators.required,
				Validators.maxLength(45),
			]),
			addressLine2: new FormControl('', [Validators.maxLength(45)]),
			cityName: new FormControl(''),
			provinceCode: new FormControl('', Validators.minLength(2)),
			postalCode: new FormControl('', Validators.minLength(6)),
			countryCode: new FormControl('', Validators.minLength(2)),
		});
	}

  changeMode() {
    this.form.enable();
    this.readonly = false;
  }
	onSubmit() {
		this.submitForm.emit(this.form.value);
	}
}
