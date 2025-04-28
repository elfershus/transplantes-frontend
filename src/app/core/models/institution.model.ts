export interface Institution {
    id?: number;
    name: string;
    address: string;
    phone?: string;
    email?: string;
    licenseNumber: string;
    createdAt?: Date;
    updatedAt?: Date;
  }