export interface Donor {
  id?: number;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  bloodType: string;
  gender: string;
  organsDonated: string[];
  healthStatus: string;
  medicalHistory: string;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  registrationDate: Date;
  isActive: boolean;
  consentFormSigned: boolean;
  donorId: string; // Unique identifier in the donor registry
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}
