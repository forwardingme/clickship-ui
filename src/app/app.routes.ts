import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { ShipmentTypeComponent } from "./shipment-type/shipment-type.component";
import { DestinationComponent } from "./destination/destination.component";
import { RateRequestComponent } from "./rate-request/rate-request.component";
import { ShippingDetailsComponent } from "./shipping-details/shipping-details.component";
import { PaymentComponent } from "./payment/payment.component";
import { PickupAddressComponent } from "./pickup-address/pickup-address.component";
import { ShipmentComponent } from "./shipment/shipment.component";

export const routes: Routes = [
	{ path: "", component: HomeComponent, title: "Set Language" },
	{
		path: "shipment-type",
		component: ShipmentTypeComponent,
		title: "Set Shipment Type",
	},
	{
		path: "destination",
		component: DestinationComponent,
		title: "Set Destination",
	},
	{
		path: "rate-request",
		component: RateRequestComponent,
		title: "Rate Request",
		// providers: [provideEffects(ParcelEffects)],
	},
	{
    path: 'shipping-details',
    component: ShippingDetailsComponent
  },
	{
    path: 'payment',
    component: PaymentComponent
  },
	{
    path: 'shipments/:trackingNumber',
    component: ShipmentComponent
  },
	{
    path: 'pickup-address',
    component: PickupAddressComponent
  }
];
