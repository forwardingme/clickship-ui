import { createReducer, on } from "@ngrx/store";
import { CANADA_CODE, DestinationEnum, LanguageEnum, ParcelType, PickupDetails, Tab, UnitOfMeasurement } from "../models/shared.models";
import { ParcelActions } from "./actions";
import { CustomerDetails } from "../models/customerDetails";
import { Package } from "../models/package";
import { RateResponse } from "../models/rateResponse";

export interface State {
  step: Tab;
  languange: LanguageEnum;
  parcelType: ParcelType | null;
  destination: DestinationEnum | null;
  shipperDetails: CustomerDetails;
  receiverDetails: CustomerDetails;
  pickupDetails: PickupDetails | null;
  packages: Package[];
  isCustomsDeclarable: boolean;
  unitOfMeasurement: UnitOfMeasurement;
  rateResponse: RateResponse | null;
  confirmed: boolean;
  paid: boolean;
  shipmentTrackingNumber: string | null;
  loading: boolean;
  documents: string[];
}
const initialCustomerDetails: CustomerDetails = {
  fullName: '',
  companyName: '',
  phone: '',
  email: '',
  addressLine1: '',
  addressLine2: '',
  cityName: '',
  provinceCode: '',
  countryCode: '',
  postalCode: '',
}

export const initialPackage: Package = {
  weight: 1,
  height: 1,
  length: 1,
  width: 1,
}
export const initState: State = {
  step: Tab.LANGUAGE,
  languange: LanguageEnum.FR,
  parcelType: null,
  destination: null,
  shipperDetails: {
    ...initialCustomerDetails,
    countryCode: CANADA_CODE,
    provinceCode: 'QC',
  },
  receiverDetails: initialCustomerDetails,
  pickupDetails: {
    ...initialCustomerDetails,
    id: null,
    countryCode: CANADA_CODE,
    provinceCode: 'QC',
  },
  packages: [initialPackage],
  isCustomsDeclarable: false,
  unitOfMeasurement: UnitOfMeasurement.IMPERIAL,
  rateResponse: null,
  confirmed: false,
  paid: false,
  shipmentTrackingNumber: null,
  loading: false,
  documents: [],
}

export const parcelReducer = createReducer(initState,
  on(ParcelActions.setLanguage, (state, { language }) => ({...state, language, step: 2, rateResponse: null })),
  on(ParcelActions.setParcelType, (state, { parcelType }) => ({...state, parcelType, step: 3, rateResponse: null })),
  on(ParcelActions.setDestination, (state, { destination }) => {
    const receiverDetails = destination === state.destination ? state.receiverDetails : initialCustomerDetails;
    return {
      ...state,
      destination,
      rateResponse: null,
      receiverDetails: {
        ...receiverDetails,
        countryCode: destination === DestinationEnum.DOMESTIC ? CANADA_CODE: receiverDetails.countryCode,
      }
    };
  }),
  on(ParcelActions.rateRequest, (state, { parcel }) => ({...state, loading: true, ...parcel })),
  on(ParcelActions.setRateRequest, (state, { rateResponse }) => ({...state, loading: false, rateResponse})),
  on(ParcelActions.confirmDetails, (state, { parcel}) => ({ ...state, ...parcel, confirmed: true })),
  on(ParcelActions.createShipment, (state) => ({...state, loading: true })),
  on(ParcelActions.savePickupDetails, (state) => ({...state, loading: true })),
  on(ParcelActions.setPickupDetails, (state, { pickupDetails }) => ({...state, pickupDetails, loading: false })),
  on(ParcelActions.setError, (state, { error }) => ({...state, loading: false })),
  on(ParcelActions.createShipemntSuccess, (state, { documents, shipmentTrackingNumber }) => ({...state, documents, shipmentTrackingNumber, loading: false })),
);
