export interface Doctor {
  id?: number;
  firstName: string;
  lastName: string;
  specialty: string;
  licenseNumber: string;
  email: string;
  phone?: string;
  institutions?: Institution[];
  createdAt?: Date;
  updatedAt?: Date;
}
