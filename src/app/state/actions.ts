import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DestinationEnum, ParcelType, PickupDetails } from '../models/shared.models';
// import { CustomerDetails } from '../models/customerDetails';
import { Parcel } from '../models/parcel';
import { RateResponse } from '../models/rateResponse';

export const ParcelActions = createActionGroup({
  source: 'Parcels',
  events: {
    'Set Language': props<{ language: Readonly<string> }>(),
    'Set Parcel Type': props<{ parcelType: Readonly<ParcelType> }>(),
    'Set Destination': props<{ destination: Readonly<DestinationEnum> }>(),
    // 'Set Shipper Details': props<{ shipperDetails: Readonly<CustomerDetails> }>(),
    // 'Set Receiver Details': props<{ receiverDetails: Readonly<CustomerDetails> }>(),
    // 'Set Packages': props<{ packages: Package[] }>(),
    'Rate Request': props<{ parcel: Readonly<Parcel> }>(),
    'Set Rate Request': props<{ rateResponse: Readonly<RateResponse | null> }>(),
    'Confirm Details': props<{ parcel: Readonly<Parcel> }>(),
    'Create Shipment': emptyProps(),
    // 'Save Pickup Details': props<{ pickupDetails: Readonly<CustomerDetails> }>(),
    'Set Pickup Details': props<{ pickupDetails: Readonly<PickupDetails | null> }>(),
    'Get Pickup Address': emptyProps(),
    'Set Error': props<{ error: Readonly<any> }>(),
    'CreateShipemntSuccess': props<{ documents: string[], shipmentTrackingNumber: string }>(),
    'Seach Machine': props<{ id: string }>(),
    'Reset': emptyProps(),
  },
});
