import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ParcelActions } from '../state/actions';
import { HeaderComponent } from '../components/header.component';
import { Observable } from 'rxjs';
import { documentsSelector } from '../state/selectors';
import { CommonModule } from '@angular/common';
import { SafePipe } from '../components/safe.pipe';

@Component({
  selector: 'app-shipment',
  standalone: true,
  imports: [HeaderComponent, CommonModule, SafePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container">
      <app-header title="Shipment" [showProgress]="false" [showClose]="true" [showPrev]="false" (close)="reset()"></app-header>
      <div class="page-title">Shipment Details</div>
      <div class="content">
        <ng-container *ngIf="!!shipmentTrackingNumber">
          <div>Shipment Tracking Number: {{shipmentTrackingNumber}}</div>
          <div *ngIf="!(documents$ | async)?.length">Shipment Not Found</div>
          <div *ngFor="let document of documents$ | async">
            <iframe class="pdf" 
              [src]="('data:application/pdf;base64,'+ document) | safe"
              width="100%"
              height="500">
            </iframe>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styleUrls: ['./shipment.component.scss']
})
export class ShipmentComponent {
  documents$: Observable<string[]>;
  shipmentTrackingNumber: string;
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  constructor() {
    this.documents$ = this.store.select(documentsSelector);
    this.shipmentTrackingNumber = this.route.snapshot.params['trackingNumber'];
  }

  reset() {
    this.store.dispatch(ParcelActions.reset());
    this.router.navigateByUrl('');
  }
}
