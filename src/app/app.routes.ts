import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { ShipmentTypeComponent } from "./shipment-type/shipment-type.component";
import { DestinationComponent } from "./destination/destination.component";
import { RateRequestComponent } from "./rate-request/rate-request.component";
import { ShippingDetailsComponent } from "./shipping-details/shipping-details.component";
import { PaymentComponent } from "./payment/payment.component";
import { SettingsComponent } from "./settings/settings.component";
import { ShipmentComponent } from "./shipment/shipment.component";
import { checkMachineGuard } from "./state/check-machine.guard";
import { CustomsInvoiceComponent } from "./customs-invoice/customs-invoice.component";

export const routes: Routes = [
	{ path: "", component: HomeComponent, title: "Set Language" },
	{
		path: "shipment-type",
		component: ShipmentTypeComponent,
		title: "Set Shipment Type",
		canActivate: [checkMachineGuard()]
	},
	{
		path: "destination",
		component: DestinationComponent,
		title: "Set Destination",
		canActivate: [checkMachineGuard()]
	},
	{
		path: "rate-request",
		component: RateRequestComponent,
		title: "Rate Request",
		canActivate: [checkMachineGuard()]
	},
	{
    path: 'shipping-details',
    component: ShippingDetailsComponent,
		canActivate: [checkMachineGuard()]
  },
	{
    path: 'customs-invoice',
    component: CustomsInvoiceComponent,
		canActivate: [checkMachineGuard()]
  },
	{
    path: 'payment',
    component: PaymentComponent,
		canActivate: [checkMachineGuard()]
  },
	{
    path: 'shipments/:trackingNumber',
    component: ShipmentComponent
  },
	{
    path: 'settings',
    component: SettingsComponent
  }
];
