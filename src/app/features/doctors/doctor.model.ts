import { Institution } from '../../core/models/institution.model';

export interface Doctor {
  id?: number;
  name: string;
  firstName: string;
  lastName: string;
  specialty: string;
  licenseNumber: string;
  email: string;
  phone: string;
  phoneNumber: string;
  institutions?: Institution[];
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
