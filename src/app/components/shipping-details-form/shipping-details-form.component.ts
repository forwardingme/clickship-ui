import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
	FormBuilder,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { NgFor, NgIf } from "@angular/common";
import { Parcel } from "../../models/parcel";
import { DestinationHeaderComponent } from "../destination-header.component";
import { TrimTextDirective } from "../trim-text.directive";
import { MaskDirective } from "../mask.directive";

@Component({
	standalone: true,
	imports: [ReactiveFormsModule, NgFor, NgIf, DestinationHeaderComponent, TrimTextDirective, MaskDirective],
	selector: "app-shipping-details-form",
	templateUrl: "./shipping-details-form.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
	// styleUrls: ["./shipping-details-form.component.scss"],
})
export class ShipperDetailsFormComponent implements OnInit {
	form: FormGroup;
	isUsOrCa = false;
	@Input() domestic: boolean | null = false;
	@Input()
	set parcel(data: Parcel | null) {
		this._parcel = data;
		if (!!data) {
      const {shipperDetails, receiverDetails} = data;
			this.isUsOrCa = ['US', 'CA'].includes(receiverDetails.countryCode);
			this.form.patchValue({
        shipperDetails: {
          ...shipperDetails,
          addressLine3: `${shipperDetails.cityName}, ${shipperDetails.postalCode}, ${shipperDetails.countryCode}`
        },
        receiverDetails: {
          ...receiverDetails,
          addressLine3: `${receiverDetails.cityName}, ${receiverDetails.postalCode}, ${receiverDetails.countryCode}`
        }
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
        companyName: new FormControl('', [Validators.maxLength(70)]),
        phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
        email: new FormControl('', [Validators.maxLength(70)]),
        addressLine1: new FormControl('', [Validators.required, Validators.maxLength(45)]),
        addressLine2: new FormControl('', [Validators.maxLength(45)]),
				addressLine3: new FormControl(''),
			}),
			receiverDetails: new FormGroup({
        fullName: new FormControl(''),
        companyName: new FormControl(''),
        phone: new FormControl(''),
        email: new FormControl(''),
        addressLine1: new FormControl(''),
        addressLine2: new FormControl(''),
				addressLine3: new FormControl(''),
			}),
		});
	}
	ngOnInit(): void {}

	onSubmit() {
		let obj = this.form.value;
		if (!!this.parcel) {
			obj.receiverDetails = {...this.parcel.receiverDetails, ...obj.receiverDetails};
			obj.shipperDetails = {...this.parcel.shipperDetails, ...obj.shipperDetails};
			obj = {...this.parcel, ...obj};
		}
		this.submitForm.emit(obj);
	}
}
