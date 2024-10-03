import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
	FormArray,
	FormBuilder,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { ISO3166_Countries, ISO_Country } from '../../models/country';
import { NgFor, NgIf } from '@angular/common';
import { Parcel } from '../../models/parcel';
import { CANADA_CODE, ParcelType } from '../../models/shared.models';
import { Package } from '../../models/package';
import { RateResponse } from '../../models/rateResponse';
import { initialPackage } from '../../state/reducer';
import { DestinationHeaderComponent } from '../destination-header.component';
import { TrimTextDirective } from '../trim-text.directive';

@Component({
	standalone: true,
	imports: [ReactiveFormsModule, NgFor, NgIf, DestinationHeaderComponent, TrimTextDirective],
	selector: 'app-rate-request-form',
	templateUrl: './rate-request-form.component.html',
	// styleUrls: ["./rate-request-form.component.scss"],
})
export class RateRequestFormComponent implements OnInit {
	form: FormGroup;

	@Input()
	set parcel(data: Parcel | null) {
		if (!!data) {
			this.form.patchValue(data);
			this.createPackageFormGroup(data.packages);
			this.parcelType = data.parcelType;
		}
	}
	@Input()
	set rateResponse(r: RateResponse | null) {
		this._rateResponse = r;
		if (!!r) {
			this.form.disable();
		}
	}
	get rateResponse(): RateResponse | null {
		return this._rateResponse;
	}

	@Input() domestic: boolean | null = false;
	@Output() submitForm = new EventEmitter<Parcel>();
	@Output() resetForm = new EventEmitter();
	parcelType: ParcelType | null = null;
	private _rateResponse: RateResponse | null = null;

	constructor(private formBuilder: FormBuilder) {
		this.form = formBuilder.group({
			pickupDetailsId: new FormControl(''),
			parcelType: new FormControl(''),
			shipperDetails: new FormGroup({
				cityName: new FormControl(''),
				postalCode: new FormControl(''),
				provinceCode: new FormControl('', Validators.minLength(2)),
				countryCode: new FormControl('', Validators.minLength(2)),
			}),
			receiverDetails: new FormGroup({
				cityName: new FormControl(''),
				postalCode: new FormControl(''),
				provinceCode: new FormControl('', Validators.minLength(2)),
				countryCode: new FormControl('', Validators.minLength(2)),
			}),
			packages: formBuilder.array([]),
		});
	}
	ngOnInit(): void {}

	get isParcelPackage() {
		return this.parcelType === ParcelType.PACKAGE;
	}

	get packages(): Package[] {
		return this.form.controls['packages'].value;
	}

	get countries(): ISO_Country[] {
		if (this.domestic)
			return ISO3166_Countries.filter(
				(c) => c.alpha2Code === CANADA_CODE
			);
		return ISO3166_Countries;
	}

	createPackageFormGroup(packages: Package[]) {
		const packageGroup = this.form.controls['packages'] as FormArray;
		if (packageGroup.length > 0) return;
		packages.forEach((d) => {
			packageGroup.push(
				new FormGroup({
					weight: new FormControl(d.weight),
					width: new FormControl(d.width),
					height: new FormControl(d.height),
					length: new FormControl(d.length),
				})
			);
		});
	}
	addPackage() {
		const packageGroup = this.form.controls['packages'] as FormArray;
		packageGroup.push(
			new FormGroup({
				weight: new FormControl(initialPackage.weight),
				width: new FormControl(initialPackage.width),
				height: new FormControl(initialPackage.height),
				length: new FormControl(initialPackage.length),
			})
		);
	}
	removePackage(idx: number) {
		const packageGroup = this.form.controls['packages'] as FormArray;
		const value = packageGroup.value;

		packageGroup.setValue(
			value
				.slice(0, idx)
				.concat(value.slice(idx + 1))
				.concat(value[idx])
		);

		packageGroup.removeAt(value.length - 1);
		// packageGroup.removeAt(idx);
		// this.appRef.tick();
	}

	trackByFn(index: number, item: ISO_Country) {
		return item.alpha2Code;
	}

	trackByIndex(index: number, item: Package) {
		return index;
	}

	onSubmit() {
		this.submitForm.emit(this.form.value);
	}
	onReset() {
		this.resetForm.emit();
		this.form.enable();
	}
}
