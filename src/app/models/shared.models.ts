import { CustomerDetails } from "./customerDetails";

export enum UnitOfMeasurement {
  METRIC = 'metric',
	IMPERIAL = 'imperial',
}

export enum LanguageEnum {
	EN = 'en',
	FR = 'fr',
}

export enum ParcelType {
	ENVELOPE = 'envelope',
	PACKAGE = 'package',
}
 
export enum DestinationEnum {
	DOMESTIC = 'domestic',
	INTERNATIONAL = 'international',
}

export const CANADA_CODE = 'CA';

export enum Tab {
  LANGUAGE = 1,
  PARCEL_TYPE = 2,
  DESTINATION = 3,
  GET_RATE_REQUEST = 4,
  CONFIRM_DETAILS = 5,
	PAYMENT = 6,
	CREATE_SHIPMENT = 7,
}

export interface PickupDetails extends CustomerDetails {
	_id: string | null;
}

export interface Option {
	value: string;
	name: string;
}

export interface AddressBookRequest {
	countryCode: string;
	zipCode?: string;
	city?: string;
	stateName?: string;
}
