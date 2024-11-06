import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Option } from '../models/shared.models';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-dropdown',
	standalone: true,
	imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: DropdownComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: DropdownComponent
    }
  ],
	template: `
		<div class="group input-group" [ngClass]="{listOpen: listOpen}">
    <span class="input-group-text"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-buildings" viewBox="0 0 16 16">
  <path d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022M6 8.694 1 10.36V15h5zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5z"/>
  <path d="M2 11h1v1H2zm2 0h1v1H4zm-2 2h1v1H2zm2 0h1v1H4zm4-4h1v1H8zm2 0h1v1h-1zm-2 2h1v1H8zm2 0h1v1h-1zm2-2h1v1h-1zm0 2h1v1h-1zM8 7h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zM8 5h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zm0-2h1v1h-1z"/>
</svg></span>
			<input
        #input
				class="form-control"
				type="text"
				[placeholder]="placeholderValue"
        [attr.aria-label]="placeholder"
				[attr.maxlength]="maxlength"
				[required]="required"
        [disabled]="disabled || !required"
        (input)="onInputChange($event)"
        (focus)="onFocus()"
			/>
			<ul class="dropdown-menu" *ngIf="filteredOptions.length > 0">
				<li *ngFor="let o of filteredOptions; trackBy: trackByFn">
					<div class="dropdown-item" (click)="onSelect($event, o)">{{ o.description || o.name }}</div>
				</li>
			</ul>
		</div>
	`,
	styles: `
    .group {
      width: 100%;
      position: relative;
      ul {
        width: 100%;
        max-height: 300px;
        overflow-y: auto;
      }
    }
    .group.listOpen ul {
      display: block;
    }
    :host.ng-invalid.ng-touched,
    :host.ng-invalid.ng-dirty {
      input { border-color: var(--bs-danger);}
    }
  `,
})
export class DropdownComponent implements ControlValueAccessor, Validator, OnInit, OnDestroy {
  @ViewChild('input') input: ElementRef | undefined;
  @Input()
  set options(_options: Option[] | null) {
    this.allOptions = _options ?? [];
    this.setName();
  }
	@Input() required = false;
  @Input() debounce = 300;
  @Input() placeholder = '';
  @Input() maxlength = 100;
  @Output() select = new EventEmitter<Option>();
  @Output() valueChange = new EventEmitter<string>();
  disabled = false;
  listOpen = false;
  private value: string = '';
  private allOptions: Option[] = [];
  private touched = false;
  private inputChange$ = new Subject<string>();
  private unsubscribe$ = new Subject<string>();
  private ref = inject(ElementRef);
  ngOnInit(): void {
    this.inputChange$.pipe(
      debounceTime(this.debounce),
      distinctUntilChanged(),
      takeUntil(this.unsubscribe$)
    ).subscribe(v => {
      // this.value = v;
      // this.validate({} as AbstractControl);
      this.onChange(v);
      this.valueChange.emit(v);
    });
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next('unsubscribe emit');
    this.unsubscribe$.complete();
  }
  get filteredOptions () {
    if (!this.value) return this.allOptions;
    return this.allOptions.filter(opt => {
      const filter = this.value.replaceAll('', '(.*)');
      return new RegExp(filter, 'gi').test(opt.name);
    });
  }
  get placeholderValue() {
    return `${this.placeholder} ${this.required ? '*':''}`;
  }
  // ControlValueAccessor methods
  writeValue(value: string) {
    this.value = value;
    this.setName();
  }
  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }
  // Validator method
  validate(control: AbstractControl): ValidationErrors | null {
    // if (this.allowEmptyOptions) return null;
    if (control.value === undefined) {
      return {
        notExists: 'Control Value',
      };
    }
    return null;
  }
  onInputChange(event: Event) {
    this.markAsTouched();
    if (!this.disabled) {
      const v = (event.target as HTMLInputElement).value
      this.value = v;
      this.inputChange$.next(v);
      this.listOpen = true;
    }
  }
  onFocus() {
    this.listOpen = true;
  }
  @HostListener("document:click", ['$event', '$event.target']) 
  clicked(event: MouseEvent | TouchEvent, targetElement: HTMLElement) { 
    if (!this.ref.nativeElement.contains(event.target)) {
      this.listOpen = false;
    }
  } 
  onSelect(event: Event, opt: Option) {
    this.listOpen = false;
    event.preventDefault();
    event.stopPropagation();
    this.markAsTouched();
    if (!this.disabled) {
      this.onChange(opt.value);
      this.setInputValue(opt.name);
      this.select.emit(opt);
    }
  }
  trackByFn(index: number, item: Option) {
		return item.value;
	}
  private onChange = (value: string) => {};
  private onTouched = () => {};
  private markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }
  private setName() {
    let name: string;
    if (!this.value || this.allOptions.length === 0) {
      name = this.value;
    } else {
      name = this.allOptions.find(opt => opt.value === this.value)?.name ?? this.value;
    }
    this.setInputValue(name);
  }
  private setInputValue(v: string) {
    if (this.input) {
      this.input.nativeElement.value = v
    }
  }
}
