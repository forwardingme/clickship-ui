import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { errorSelector, loadingSelector } from './state/selectors';
import { CommonModule } from '@angular/common';
import { ParcelActions } from './state/actions';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, ReactiveFormsModule, CommonModule],
	template: `
		<div class="container" [ngClass]="{ loading: (loading$ | async) }">
			<router-outlet />
      <div class="alert alert-danger" role="alert" *ngIf="error$ | async">
        {{ error$ | async }}
      </div>
		</div>
	`,
})
export class AppComponent {
	private store = inject(Store);
	loading$: Observable<boolean>;
  error$: Observable<string | null>;

	constructor() {
		this.loading$ = this.store.select(loadingSelector);
    this.error$ = this.store.select(errorSelector);
		this.store.dispatch(ParcelActions.getPickupAddress());
	}
}
