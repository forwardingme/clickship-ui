import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DestinationEnum } from '../models/shared.models';
import { ParcelActions } from '../state/actions';
import { HeaderComponent } from '../components/header.component';
import { IconsComponent } from '../components/icons.component';
import { Observable } from 'rxjs';
import { stepNumSelector } from '../state/selectors';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-destination',
  standalone: true,
  imports: [HeaderComponent, IconsComponent, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
   <div class="container">
    <app-header class="app-header" [step]="3" [steps]="steps$ | async"></app-header>
    <div class="page-title">Press to Choose Destination</div>
    <div class="d-flex flex-wrap align-items-center justify-content-center flex-fill">
      <div class="d-flex justify-content-center py-2 gap-5">
        <div class="selection p-4" title="International" (click)="setDestination(DestinationEnum.OTHERS)">
          <img src="assets/images/globe.svg" alt="International" />
          <div class="text-center"><button class="button">International</button></div>
        </div>
        <div class="selection p-4" title="USA" (click)="setDestination(DestinationEnum.US)">
          <img src="assets/images/usa.svg" alt="USA" />
          <div class="text-center"><button class="button">USA</button></div>
        </div>
        <div class="selection p-4" title="Canada" (click)="setDestination(DestinationEnum.CA)">
          <img src="assets/images/canada.svg" alt="Canada" />
          <div class="text-center"><button class="button">Canada</button></div>
        </div>
      </div>
    </div>
    <app-icons></app-icons>
  </div>
  `,
styleUrls: ['./destination.component.scss']
})
export class DestinationComponent {
  steps$: Observable<number>;
  DestinationEnum = DestinationEnum;
  private store = inject(Store);
  private router = inject(Router);

  constructor() {
    this.steps$ = this.store.select(stepNumSelector);
  }

  setDestination(destination: DestinationEnum) {
    this.store.dispatch(ParcelActions.setDestination({ destination }));
    this.router.navigateByUrl('rate-request');
  }
}
