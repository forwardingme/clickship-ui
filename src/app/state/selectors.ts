import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State } from './reducer';
import { Parcel } from '../models/parcel';
import { CANADA_CODE } from '../models/shared.models';
import { CustomerDetails } from '../models/customerDetails';

export const featureSelector = createFeatureSelector<
  Readonly<State>
>('parcel');

export const loadingSelector = createSelector(
  featureSelector,
  (feature) => {
    return feature.loading;
  }
);

export const languageSelector = createSelector(
  featureSelector,
  (feature) => {
    return feature.languange;
  }
);

export const parcelTypeSelector = createSelector(
  featureSelector,
  (feature) => {
    return feature.parcelType;
  }
);

export const destinationSelector = createSelector(
  featureSelector,
  (feature) => {
    return feature.destination;
  }
);

export const pickupAddressSelector = createSelector(
  featureSelector,
  (feature) => {
    return feature.pickupDetails;
  }
);

export const isValidPickupAddressSelector = createSelector(
  featureSelector,
  (feature) => {
    return isValidPickupAddress(feature.pickupDetails);
  }
);

export const parcelSelector = createSelector(
  featureSelector,
  (feature): Parcel => {
    const { shipperDetails, receiverDetails, packages, pickupDetails, parcelType, shipmentTrackingNumber, rateResponse, lineItems } = feature;
    return {
      pickupDetailsId: pickupDetails?._id ?? null,
      shipperDetails,
      receiverDetails,
      parcelType,
      packages,
      // unitOfMeasurement,
      shipmentTrackingNumber,
      price: rateResponse?.rate ?? null,
      lineItems,
    };
  }
);

export const createShipmentRequestSelector = createSelector(
  parcelSelector,
  (parcel) => {
    const shipperDetails = { ...parcel.shipperDetails };
    const receiverDetails = { ...parcel.receiverDetails };
    shipperDetails.companyName = !!shipperDetails.companyName ? shipperDetails.companyName : shipperDetails.fullName;
    receiverDetails.companyName = !!receiverDetails.companyName ? receiverDetails.companyName : receiverDetails.fullName;
    return {...parcel, shipperDetails, receiverDetails};
  }
);

export const rateResponseSelector = createSelector(
  featureSelector,
  (feature) => {
    return feature.rateResponse;
  }
);

export const detailsConfirmedSelector = createSelector(
  featureSelector,
  (feature) => {
    return feature.confirmed;
  }
);

export const errorSelector = createSelector(
  featureSelector,
  (feature) => {
    return feature.error;
  }
);

export const documentsSelector = createSelector(
  featureSelector,
  (feature) => {
    return feature.documents;
  }
);

export const addressbooksSelector = createSelector(
  featureSelector,
  (feature) => {
    return feature.addressBooks;
  }
);
export const shipperAddressbooksSelector = createSelector(
  featureSelector,
  (feature) => {
    return feature.shipperAddressBooks;
  }
);

export const lineItemsSelector = createSelector(
  featureSelector,
  (feature) => {
    return feature.lineItems;
  }
);

export function isValidPickupAddress(address: CustomerDetails | null): boolean {
  return !!address && !!address.fullName && !!address.addressLine1 && !!address.cityName
    && !!address.postalCode && !!address.phone && address.countryCode === CANADA_CODE;
}
