import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Parcel } from "../models/parcel";
import { AddressSearchRequest } from "../models/shared.models";

@Injectable({
	providedIn: "root",
})
export class ParcelService {
	private API_URL = 'http://ec2-3-22-234-193.us-east-2.compute.amazonaws.com/api';
	constructor(private http: HttpClient) {}

	rateRquest(parcel: Parcel) {
		return this.http.post<any>(`${this.API_URL}/rate-request`, parcel);
	}

  createShipment(parcel: Parcel) {
    return this.http.post(`${this.API_URL}/shipments`, parcel);
  }

	searchMichineById(id: string) {
		return this.http.get<any>(`${this.API_URL}/machines/${id}`);
	}

	searchAddressBook(request: AddressSearchRequest) {
		return this.http.post(`${this.API_URL}/addressbook`, request);
	}
}
