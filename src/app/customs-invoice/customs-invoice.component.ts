import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../components/header.component';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { lineItemsSelector } from '../state/selectors';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ParcelActions } from '../state/actions';
import { CustomsInvoiceFormComponent } from '../components/customs-invoice-form/customs-invoice-form.component';
import { LineItem } from '../models/invoice';

@Component({
  selector: 'app-customs-invoice',
  standalone: true,
  imports: [HeaderComponent, CommonModule, CustomsInvoiceFormComponent],
  templateUrl: './customs-invoice.component.html',
  // styleUrls: ['./customs-invoice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomsInvoiceComponent implements OnInit{
  items$: Observable<LineItem[] | null>;

  private store = inject(Store);
  private router = inject(Router);

  constructor() {
    this.items$ = this.store.select(lineItemsSelector);
  }

  ngOnInit(): void { }

  onSubmit(lineItems: LineItem[]) {
    this.store.dispatch(ParcelActions.setLineItems({ lineItems }));
    this.router.navigateByUrl('payment');
  }
}
