import { CustomerDetails } from "./customerDetails";

export enum LanguageEnum {
	EN = 'en',
	FR = 'fr',
}

export enum ParcelType {
	ENVELOPE = 'envelope',
	PACKAGE = 'package',
}
export enum DestinationEnum {
	CA = 'CA',
	US = 'US',
	OTHERS = 'OTHERS',
	// DOMESTIC = 'domestic',
	// INTERNATIONAL = 'international',
}

export const CANADA_CODE = 'CA';

// export enum Tab {
//   LANGUAGE = 1,
//   PARCEL_TYPE = 2,
//   DESTINATION = 3,
//   GET_RATE_REQUEST = 4,
//   CONFIRM_DETAILS = 5,
// 	PAYMENT = 6,
// 	CREATE_SHIPMENT = 7,
// }

export interface PickupDetails extends CustomerDetails {
	_id: string | null;
}

export interface Option {
	value: string;
	name: string;
	description?: string;
	item?: any;
}

export interface AddressBook {
	city: string;
	country: string;
	postalCode?: string;
	countryDivisionCode?: string;
}
export enum FromEnum {
	RECEIVER = 'receiver',
	SHIPPER = 'shipper',
}
export interface AddressSearchRequest {
	control: 'postalCode' | 'city' | 'state';
	value: string;
	countryCode: string;
	from: FromEnum;
}

export const STEP_NUM = 6;
