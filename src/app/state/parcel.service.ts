import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Parcel } from "../models/parcel";
import { CustomerDetails } from "../models/customerDetails";

@Injectable({
	providedIn: "root",
})
export class ParcelService {
	private API_URL = 'http://ec2-3-141-107-46.us-east-2.compute.amazonaws.com:3000/api';
	constructor(private http: HttpClient) {}
	rateRquest(parcel: Parcel) {
		return this.http.post<any>(`${this.API_URL}/rate-request`, parcel);
	}

  createShipment(parcel: Parcel) {
    return this.http.post(`${this.API_URL}/create-shipment`, parcel);
  }

	savePickupAddress(address: CustomerDetails) {
		return this.http.post<any>(`${this.API_URL}/pickup-address`, address);
	}
}
