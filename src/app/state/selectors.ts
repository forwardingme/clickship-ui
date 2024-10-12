import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State } from './reducer';
import { Parcel } from '../models/parcel';
import { CANADA_CODE, DestinationEnum } from '../models/shared.models';
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

export const isDomesticSelector = createSelector(
  featureSelector,
  (feature) => {
    return feature.destination === DestinationEnum.DOMESTIC;
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
    const { isCustomsDeclarable, shipperDetails, receiverDetails, packages, unitOfMeasurement, pickupDetails, parcelType, shipmentTrackingNumber } = feature;
    return {
      pickupDetailsId: pickupDetails?._id ?? null,
      shipperDetails: {
        ...shipperDetails,
        postalCode: !shipperDetails.postalCode && !!pickupDetails?.postalCode ? pickupDetails?.postalCode : shipperDetails.postalCode,
        cityName: !shipperDetails.cityName && !!pickupDetails?.cityName ? pickupDetails?.cityName : shipperDetails.cityName,
      },
      receiverDetails,
      parcelType,
      packages,
      isCustomsDeclarable,
      unitOfMeasurement,
      shipmentTrackingNumber
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

export const documentsSelector = createSelector(
  featureSelector,
  (feature) => {
    return feature.documents;
  }
);

export function isValidPickupAddress(address: CustomerDetails | null): boolean {
  return !!address && !!address.fullName && !!address.addressLine1 && !!address.cityName
    && !!address.postalCode && !!address.phone && address.countryCode === CANADA_CODE;
}
