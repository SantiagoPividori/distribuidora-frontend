import { UUID } from 'crypto';

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

export interface ClientUI extends ClientModel {
  initial: string; // primera letra para el avatar
  tag: 'Premium' | 'Regular' | 'Nuevo'; // badge visual
}

// ── Función para convertir ClientModel → ClientUI ─
export function toClientUI(client: ClientModel): ClientUI {
  return {
    ...client,
    initial: client.businessName.charAt(0).toUpperCase(),
    tag: 'Regular', // podés derivarlo de algún campo del backend después
  };
}