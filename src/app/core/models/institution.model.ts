export interface Institution {
  id?: number;
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  accreditationNumber?: string;
  accreditationStatus?: string;
  capacity?: number;
  specialties?: string[];
  transportCapabilities?: boolean;
  operatingHours?: string;
  emergencyContact?: string;
  latitude?: number;
  longitude?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
