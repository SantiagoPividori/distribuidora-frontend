import { UUID } from "crypto";

export interface ClientModel {
    id?: UUID;
    businessName: string;
    firstName: string;
    lastName: string;
    address: string;
    phoneNumber: string;
    taxId: string;
}

export interface ClientRequest {
    businessName: string;
    firstName: string;
    lastName: string;
    address: string;
    phoneNumber: string;
    taxId: string;
}