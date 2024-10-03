import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, from, of } from 'rxjs';
import { map, switchMap, catchError, take, mergeMap, filter } from 'rxjs/operators';
import { ParcelService } from './parcel.service';
import { ParcelActions } from './actions';
import { Store } from '@ngrx/store';
import { createShipmentRequestSelector, isValidPickupAddressSelector, parcelSelector } from './selectors';
import { Router } from '@angular/router';
const PICKUP_ADDRESS = 'pickup-address';

@Injectable()
export class ParcelEffects {
	private actions$ = inject(Actions);
	private parcelService = inject(ParcelService);
	private store = inject(Store);
	private router = inject(Router);

	rateRequest$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ParcelActions.rateRequest),
			switchMap((action) => {
				return this.parcelService.rateRquest(action.parcel).pipe(
					map((res) => {
						if (!res?.products?.length) {
							return ParcelActions.setError({ error: { message: 'No matched product'}});
						}

						const rate = res.products[0]?.totalPrice[0]?.price;
						const estimatedTransitDays = res.products[0]?.deliveryCapabilities?.totalTransitDays;
						return ParcelActions.setRateRequest({
							rateResponse: {
								rate,
								estimatedTransitDays,
							},
						})
					}),
					catchError((error) => of(ParcelActions.setError({error})))
				);
			})
		)
	);

	createShipment$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ParcelActions.createShipment),
			switchMap((action) => {
				return this.store.select(createShipmentRequestSelector).pipe(
					take(1),
					switchMap((parcel) => {
						return this.parcelService.createShipment(parcel).pipe(
							mergeMap((res: any) => {
								const documents = (res.documents || []).map((d: any) => d.content);
								const shipmentTrackingNumber = res.shipmentTrackingNumber;
								this.router.navigateByUrl(`shipments/${shipmentTrackingNumber}`);
								return from([
									ParcelActions.setRateRequest({ rateResponse: null }),
									ParcelActions.createShipemntSuccess({ documents, shipmentTrackingNumber  }),
								]);
							}),
							catchError((error) => of(ParcelActions.setError({error})))
						);
					})
				);
			})
		)
	);

	getPickupAddress$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ParcelActions.getPickupAddress),
			mergeMap(() => {
				return this.store.select(isValidPickupAddressSelector).pipe(
					take(1),
					filter((isValidPickupAddress) => !isValidPickupAddress),
					mergeMap(() => {
						const address = localStorage.getItem(PICKUP_ADDRESS);
						if (address === null) {
							return of();
						}
						const pickupDetails = JSON.parse(address);
						return of(ParcelActions.setPickupDetails({ pickupDetails }));
					})
				);
			})
		)
	);

	savePickupAddress$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ParcelActions.savePickupDetails),
			switchMap((action) => {
				return this.parcelService.savePickupAddress(action.pickupDetails).pipe(
					mergeMap((res) => {
						const pickupDetails = {...action.pickupDetails, id: res._id};
						localStorage.setItem(PICKUP_ADDRESS, JSON.stringify(pickupDetails));
						return from([
							ParcelActions.setPickupDetails({pickupDetails}),
						]);
					}),
					catchError(() => EMPTY)
				);
			})
		)
	);

	constructor() {}
}
