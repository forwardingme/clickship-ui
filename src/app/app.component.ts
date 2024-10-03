import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loadingSelector } from './state/selectors';
import { CommonModule, NgIf } from '@angular/common';
import { ParcelActions } from './state/actions';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, ReactiveFormsModule, CommonModule],
	template: `
		<div class="container" [ngClass]="{ loading: (loading$ | async) }">
			<router-outlet />
		</div>
	`,
	styles: `
    .loading::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--bs-light);
      opacity: 0.8;
  }
  .loading::after {
      content: " ";
      position: absolute;
      margin-left: auto;
      margin-right: auto;
      z-index: 1001;
      left: 0;
      right: 0;
      top: 300px;
      transform: translateY(-50%);
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 5px solid var(--bs-primary);
      border-color: var(--bs-primary) transparent var(--bs-primary) transparent;
      animation: loader 1.2s linear infinite;
  }
  @keyframes loader {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
}
  `,
})
export class AppComponent {
	private store = inject(Store);
	loading$: Observable<boolean>;

	constructor() {
		this.loading$ = this.store.select(loadingSelector);
		this.store.dispatch(ParcelActions.getPickupAddress());
	}
}
