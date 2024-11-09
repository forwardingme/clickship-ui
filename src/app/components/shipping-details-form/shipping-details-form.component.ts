import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
	FormBuilder,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { NgIf } from "@angular/common";
import { Parcel } from "../../models/parcel";
import { DestinationHeaderComponent } from "../destination-header.component";
import { TrimTextDirective } from "../trim-text.directive";
import { MaskDirective } from "../mask.directive";
import { CANADA_CODE } from "../../models/shared.models";
import { countryOptions } from "../../models/country";
import { DropdownComponent } from "../dropdown.component";

@Component({
	standalone: true,
	imports: [ReactiveFormsModule, NgIf, DestinationHeaderComponent, TrimTextDirective, MaskDirective, DropdownComponent],
	selector: "app-shipping-details-form",
	templateUrl: "./shipping-details-form.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
	// styleUrls: ["./shipping-details-form.component.scss"],
})
export class ShipperDetailsFormComponent implements OnInit {
	form: FormGroup;
	isUsOrCa = false;
	domestic = false;
	countries = countryOptions;
	@Input()
	set parcel(data: Parcel | null) {
		this._parcel = data;
		if (!!data) {
      const {shipperDetails, receiverDetails} = data;
			this.domestic = receiverDetails.countryCode === CANADA_CODE;
			this.isUsOrCa = ['US', 'CA'].includes(receiverDetails.countryCode);
			this.form.patchValue({
        shipperDetails,
        receiverDetails
      });
			if(this.isUsOrCa) {
				const phoneCtrl = (this.form.controls['receiverDetails'] as FormGroup).controls['phone'];
				phoneCtrl.addValidators([Validators.minLength(10), Validators.maxLength(10)]);
			}
		}
	}
	get parcel(): Parcel | null {
		return this._parcel;
	}
	@Output() submitForm = new EventEmitter<Parcel>();
	private _parcel: Parcel | null = null;

	constructor(formBuilder: FormBuilder) {
		this.form = formBuilder.group({
			pickupDetailsId: new FormControl(''),
			shipperDetails: new FormGroup({
        fullName: new FormControl('', [Validators.required, Validators.maxLength(70)]),
        phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
        email: new FormControl('', [Validators.maxLength(70)]),
        addressLine1: new FormControl('', [Validators.required, Validators.maxLength(45)]),
				cityName: new FormControl('', [Validators.minLength(2), Validators.maxLength(45)]),
				postalCode: new FormControl('', [Validators.minLength(6), Validators.maxLength(8),
					 Validators.pattern(/^[a-zA-Z][0-9][a-zA-Z](\s){0,1}[0-9][a-zA-Z][0-9]$/)]),
				countryCode: new FormControl('', [Validators.minLength(2), Validators.maxLength(2)]),
			}),
			receiverDetails: new FormGroup({
        fullName: new FormControl(''),
        phone: new FormControl(''),
        email: new FormControl(''),
        addressLine1: new FormControl(''),
        cityName: new FormControl('', [Validators.minLength(2), Validators.maxLength(45)]),
				postalCode: new FormControl(''),
				provinceCode: new FormControl('', Validators.minLength(2)),
				provinceName: new FormControl('', Validators.minLength(2)),
				countryCode: new FormControl('', [Validators.minLength(2), Validators.maxLength(2)]),
			}),
		});
	}
	ngOnInit(): void {}

	onSubmit() {
		this.submitForm.emit(this.form.value);
	}
}
