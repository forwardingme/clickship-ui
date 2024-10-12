import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Parcel } from "../models/parcel";
import { CustomerDetails } from "../models/customerDetails";
import { AddressBookRequest } from "../models/shared.models";

@Injectable({
	providedIn: "root",
})
export class ParcelService {
	private API_URL = 'http://ec2-3-22-234-193.us-east-2.compute.amazonaws.com:3000/api';
	constructor(private http: HttpClient) {}

	rateRquest(parcel: Parcel) {
		return this.http.post<any>(`${this.API_URL}/rate-request`, parcel);
	}

  createShipment(parcel: Parcel) {
    return this.http.post(`${this.API_URL}/shipments`, parcel);
  }

	savePickupAddress(address: CustomerDetails) {
		return this.http.post<any>(`${this.API_URL}/pickup-address`, address);
	}

	searchMichineById(id: string) {
		return this.http.get<any>(`${this.API_URL}/machines/${id}`);
	}

	searchAddressBook(request: AddressBookRequest) {
		const path = 'https://mydhl.express.dhl/api/addressbook/search';
		const params = Object.keys(request).map((key: string) => `${key}=${request[key as keyof AddressBookRequest]}`).join('&');
		return this.http.get<any>(`${path}?${params}`);
	}
}
