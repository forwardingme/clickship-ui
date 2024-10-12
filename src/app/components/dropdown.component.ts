import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
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
		<div class="group" [ngClass]="{listOpen: listOpen}">
			<input
        id="input"
				class="form-control"
				type="text"
				[placeholder]="placeholder"
        [attr.aria-label]="placeholder"
				[attr.maxlength]="maxlength"
        [value]="name"
				[required]="required"
        [disabled]="disabled"
        (input)="onInputChange($event)"
			/>
			<ul class="dropdown-menu" *ngIf="filteredOptions.length > 0">
				<li *ngFor="let o of filteredOptions; trackBy: trackByFn">
					<div class="dropdown-item" (click)="onSelect($event, o)">{{ o.name }}</div>
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
  name: string = '';
  disabled = false;
  listOpen = false;
  private value: string = '';
  private allOptions: Option[] = [];
  private touched = false;
  private inputChange$ = new Subject<string>();
  private unsubscribe$ = new Subject<string>();

  ngOnInit(): void {
    this.inputChange$.pipe(
      debounceTime(this.debounce),
      distinctUntilChanged(),
      takeUntil(this.unsubscribe$)
    ).subscribe(v => {
      // this.value = v;
      // this.validate({} as AbstractControl);
      this.onChange(v);
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
    }
  }

  @HostListener("document:click", ['$event', '$event.target']) 
  clicked(event: MouseEvent | TouchEvent, targetElement: HTMLElement) { 
    this.listOpen = targetElement.id === 'input';
  } 
  onSelect(event: Event, opt: Option) {
    this.listOpen = false;
    event.preventDefault();
    event.stopPropagation();
    this.markAsTouched();
    if (!this.disabled) {
      this.onChange(opt.value);
      this.name = opt.name;
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
    if (!this.value || this.allOptions.length === 0) {
      this.name = this.value;
    } else {
      this.name = this.allOptions.find(opt => opt.value.toLowerCase() === this.value.toLowerCase())?.name ?? this.value;
    }
  }
}
