import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
	FormArray,
	FormBuilder,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { NgFor, NgIf } from "@angular/common";
import { TrimTextDirective } from "../trim-text.directive";
import { LineItem, reasons } from "../../models/invoice";
import { DropdownComponent } from "../dropdown.component";
import { countryOptions } from "../../models/country";

@Component({
	standalone: true,
	imports: [ReactiveFormsModule, NgFor, NgIf, TrimTextDirective, DropdownComponent],
	selector: "app-customs-invoice-form",
	templateUrl: "./customs-invoice-form.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
	// styleUrls: ["./customs-invoice-form.component.scss"],
})
export class CustomsInvoiceFormComponent implements OnInit {
	form: FormGroup;
	countries = countryOptions;
	reasons = reasons;
	@Input()
	set items(_items: LineItem[] | null) {
		if (!!_items) {
			this.createItemFormGroup(_items);
		}
	}
	get items(): LineItem[] {
		return this.itemFa.value;
	}
	@Output() submitForm = new EventEmitter<any>();
	private itemFa: FormArray;

	constructor(formBuilder: FormBuilder) {
		this.form = formBuilder.group({
			lineItems: formBuilder.array([]),
		});
		this.itemFa = this.form.controls['lineItems'] as FormArray;
	}
	ngOnInit(): void {}

	createItemFormGroup(_items: LineItem[]) {
		if (this.itemFa.length > 0) return;
		_items.forEach((d) => {
			this.itemFa .push(
				new FormGroup({
					price: new FormControl(d.price),
					quantity: new FormControl(d.quantity),
					description: new FormControl(d.description),
					manufacturerCountry: new FormControl(d.manufacturerCountry),
					exportReasonType: new FormControl(d.exportReasonType),
				})
			);
		});
	}
	addItem() {
		this.itemFa.push(
			new FormGroup({
				price: new FormControl(''),
				quantity: new FormControl(''),
				description: new FormControl(''),
				manufacturerCountry: new FormControl('', [Validators.minLength(2), Validators.maxLength(2)]), // countryCode
				exportReasonType: new FormControl(''), 
			})
		);
	}
	onSubmit() {
		this.submitForm.emit(this.form.value.lineItems);
	}
	trackByIndex(index: number, item: LineItem) {
		return index;
	}
}
