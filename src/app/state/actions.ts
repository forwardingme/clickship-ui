import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AddressBook, AddressSearchRequest, DestinationEnum, ParcelType, PickupDetails } from '../models/shared.models';
import { Parcel } from '../models/parcel';
import { RateResponse } from '../models/rateResponse';
import { LineItem } from '../models/invoice';

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
    'Set Pickup Details': props<{ pickupDetails: Readonly<PickupDetails | null> }>(),
    'Get Pickup Address': emptyProps(),
    'Set Error': props<{ error: Readonly<string | null> }>(),
    'CreateShipemntSuccess': props<{ documents: string[], shipmentTrackingNumber: string }>(),
    'Seach Machine': props<{ id: string }>(),
    'Reset': emptyProps(),
    'Address Search': props<{ request: Readonly<AddressSearchRequest> }>(),
    'Set Address Books': props<{ addressBooks: AddressBook[] }>(),
    'Set Shipper Address Books': props<{ shipperAddressBooks: AddressBook[] }>(),
    'Set Line Items': props<{ lineItems: LineItem[] }>(),
  },
});
