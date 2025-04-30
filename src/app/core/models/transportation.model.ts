import { Organ } from './organ.model';
import { Institution } from './institution.model';

export interface Transportation {
  id?: number;
  departureTime: string;
  estimatedArrivalTime: string;
  actualArrivalTime?: string;
  transportMethod: 'ground' | 'air' | 'helicopter' | 'ambulance';
  transportCompany?: string;
  trackingNumber?: string;
  status: 'scheduled' | 'in-transit' | 'delivered' | 'delayed' | 'cancelled';
  organId?: number;
  organ?: Organ;
  originInstitutionId?: number;
  originInstitution?: Institution;
  destinationInstitutionId?: number;
  destinationInstitution?: Institution;
  createdAt?: string;
  updatedAt?: string;
}
