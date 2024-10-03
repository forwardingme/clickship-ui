import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ParcelActions } from '../state/actions';
// import { stepSelector } from '../state/selectors';
import { Router } from '@angular/router';
import { FooterComponent } from "../components/footer.component";

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [FooterComponent],
  template: `
  <div class="container text-center">
    <div class="header">
      <img class="top_img"
      src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
    </div>
    <div class="content">
      <div>
        <img class="logo_dhl"
          src="assets/images/dhl-log.svg" />
      </div>
      <div class="content">
        <div>L'excellence. Simplement livrée</div>
        <div>Excellence. Simply Delivered</div>
      </div>
      <div class="actions">
        <button class="button" (click)="selectLang('en')">
          <span class="text">English</span>
        </button>
        <button class="button" (click)="selectLang('fr')">
          <span class="text">Frainçais</span>
        </button>
      </div>
    </div>
    <app-footer></app-footer>
  </div>
  `,
 styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private store = inject(Store);
  private router = inject(Router);
  constructor() {}

  selectLang(language: string) {
    this.store.dispatch(ParcelActions.setLanguage({language}));
    this.router.navigateByUrl('shipment-type');
  }
}
