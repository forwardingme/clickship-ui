import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ParcelActions } from '../state/actions';
import { HeaderComponent } from '../components/header.component';
import { FooterComponent } from "../components/footer.component";
import { Observable } from 'rxjs';
import { documentsSelector } from '../state/selectors';
import { CommonModule } from '@angular/common';
import { SafePipe } from '../components/safe.pipe';

@Component({
  selector: 'app-shipment',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, SafePipe],
  template: `
    <div class="container">
      <app-header title="Shipment" [showClose]="true" [showPrev]="false"></app-header>
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
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            ...
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
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
}
