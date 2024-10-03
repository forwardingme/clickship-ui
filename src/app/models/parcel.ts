import { CustomerDetails } from "./customerDetails";
import { Package } from "./package";
import { ParcelType, UnitOfMeasurement } from "./shared.models";

export interface Parcel {
  parcelType: ParcelType | null;
  pickupDetailsId: string | null;
  shipperDetails: CustomerDetails;
  receiverDetails: CustomerDetails;
  packages: Package[];
  isCustomsDeclarable: boolean;
  unitOfMeasurement: UnitOfMeasurement;
  shipmentTrackingNumber: string | null;
}