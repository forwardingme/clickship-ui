import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DestinationEnum } from '../models/shared.models';
import { ParcelActions } from '../state/actions';
import { HeaderComponent } from '../components/header.component';
import { FooterComponent } from '../components/footer.component';
import { IconsComponent } from '../components/icons.component';

@Component({
  selector: 'app-destination',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, IconsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
   <div class="container">
    <app-header title="Select Destination"></app-header>
    <div class="d-flex flex-wrap align-items-center justify-content-center flex-fill">
      <div class="d-flex justify-content-center py-2 gap-5">
        <div class="selection p-4" title="Domestic" (click)="setDestination(DestinationEnum.DOMESTIC)">
          <img src="assets/images/canada.svg" alt="Domestic" />
          <div class="text-center fs-3">Canada</div>
        </div>
        <div class="selection p-4" title="International" (click)="setDestination(DestinationEnum.INTERNATIONAL)">
          <img src="assets/images/globe.svg" alt="International" />
          <div class="text-center fs-3">International</div>
        </div>
      </div>
      <app-icons></app-icons>
    </div>
    <app-footer></app-footer>
  </div>
  `,
styleUrls: ['./destination.component.scss']
})
export class DestinationComponent {
  DestinationEnum = DestinationEnum;
  private store = inject(Store);
  private router = inject(Router);

  constructor() {}

  setDestination(destination: DestinationEnum) {
    this.store.dispatch(ParcelActions.setDestination({ destination }));
    this.router.navigateByUrl('rate-request');
  }
}
