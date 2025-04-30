// src/app/features/doctors/doctor-detail/doctor-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  specialty: string;
  email: string;
  phone: string;
  institution: string;
  department: string;
  yearsOfExperience: number;
  isAvailable: boolean;
  organSpecialties: string[];
  certifications: { name: string; issuer: string; year: number }[];
  bio?: string;
  profileImageUrl?: string;
}

@Component({
  selector: 'app-doctor-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="mb-6">
        <button
          (click)="navigateBack()"
          class="text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          <span class="mr-1">←</span> Back to Doctors
        </button>
      </div>

      <div *ngIf="loading" class="flex justify-center my-10">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
        ></div>
      </div>

      <div
        *ngIf="error"
        class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
        role="alert"
      >
        <p>{{ error }}</p>
      </div>

      <div
        *ngIf="doctor && !loading"
        class="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <!-- Header with basic info -->
        <div class="p-6 md:p-8 border-b border-gray-200">
          <div class="flex flex-col md:flex-row gap-6">
            <div class="md:w-1/4">
              <div
                class="w-40 h-40 rounded-full bg-gray-200 mx-auto md:mx-0 overflow-hidden"
              >
                <img
                  *ngIf="doctor.profileImageUrl"
                  [src]="doctor.profileImageUrl"
                  alt="Doctor profile"
                  class="w-full h-full object-cover"
                />
                <div
                  *ngIf="!doctor.profileImageUrl"
                  class="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500"
                >
                  <span class="text-3xl font-bold"
                    >{{ doctor.firstName[0] }}{{ doctor.lastName[0] }}</span
                  >
                </div>
              </div>
            </div>

            <div class="md:w-3/4 text-center md:text-left">
              <div
                class="flex flex-col md:flex-row md:justify-between md:items-start"
              >
                <div>
                  <h1 class="text-2xl md:text-3xl font-bold mb-2">
                    Dr. {{ doctor.firstName }} {{ doctor.lastName }}
                  </h1>
                  <p class="text-xl text-gray-600 mb-4">
                    {{ doctor.specialty }}
                  </p>

                  <div
                    class="flex flex-wrap gap-2 mb-4 justify-center md:justify-start"
                  >
                    <span
                      class="px-3 py-1 text-sm rounded-full"
                      [ngClass]="
                        doctor.isAvailable
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : 'bg-red-100 text-red-800 border border-red-300'
                      "
                    >
                      {{ doctor.isAvailable ? 'Available' : 'Not Available' }}
                    </span>
                    <span
                      class="bg-blue-50 text-blue-700 px-3 py-1 text-sm rounded-full border border-blue-200"
                    >
                      {{ doctor.yearsOfExperience }} years experience
                    </span>
                    <span
                      class="bg-purple-50 text-purple-700 px-3 py-1 text-sm rounded-full border border-purple-200"
                    >
                      License: {{ doctor.licenseNumber }}
                    </span>
                  </div>
                </div>

                <div class="mt-4 md:mt-0">
                  <button
                    (click)="navigateToEdit()"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold mb-4">Contact Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-gray-600 font-medium">Email</p>
              <p>{{ doctor.email }}</p>
            </div>
            <div>
              <p class="text-gray-600 font-medium">Phone</p>
              <p>{{ doctor.phone }}</p>
            </div>
          </div>
        </div>

        <!-- Institution Information -->
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold mb-4">Institution</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-gray-600 font-medium">Name</p>
              <p>{{ doctor.institution }}</p>
            </div>
            <div>
              <p class="text-gray-600 font-medium">Department</p>
              <p>{{ doctor.department }}</p>
            </div>
          </div>
        </div>

        <!-- Specializations -->
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold mb-4">Organ Specializations</h2>
          <div class="flex flex-wrap gap-2">
            <span
              *ngFor="let organ of doctor.organSpecialties"
              class="bg-blue-50 text-blue-700 px-3 py-2 rounded border border-blue-200"
            >
              {{ organ }}
            </span>
          </div>
        </div>

        <!-- Certifications -->
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold mb-4">Certifications</h2>
          <div *ngIf="doctor.certifications.length === 0" class="text-gray-500">
            No certifications listed.
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              *ngFor="let cert of doctor.certifications"
              class="bg-gray-50 p-4 rounded border border-gray-200"
            >
              <p class="font-semibold text-lg">{{ cert.name }}</p>
              <p class="text-gray-600">{{ cert.issuer }}</p>
              <p class="text-gray-500 text-sm">{{ cert.year }}</p>
            </div>
          </div>
        </div>

        <!-- Biography -->
        <div *ngIf="doctor.bio" class="p-6">
          <h2 class="text-xl font-semibold mb-4">Biography</h2>
          <p class="whitespace-pre-line">{{ doctor.bio }}</p>
        </div>
      </div>
    </div>
  `,
})
export class DoctorDetailComponent implements OnInit {
  doctor: Doctor | null = null;
  loading = false;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDoctor(+id);
    } else {
      this.error = 'Doctor ID not found';
    }
  }

  loadDoctor(id: number): void {
    this.loading = true;

    // In a real application, this would call the API service
    // this.doctorService.getDoctor(id).subscribe(...)
    setTimeout(() => {
      const mockDoctor = this.getMockDoctor(id);

      if (mockDoctor) {
        this.doctor = mockDoctor;
      } else {
        this.error = 'Doctor not found';
      }

      this.loading = false;
    }, 1000);
  }

  navigateBack(): void {
    this.router.navigate(['/doctors']);
  }

  navigateToEdit(): void {
    if (this.doctor) {
      this.router.navigate(['/doctors', this.doctor.id, 'edit']);
    }
  }

  // Mock data helper for demo
  getMockDoctor(id: number): Doctor | null {
    const doctors: Doctor[] = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Smith',
        licenseNumber: 'MD123456',
        specialty: 'Transplant Surgery',
        email: 'john.smith@hospital.com',
        phone: '(555) 123-4567',
        institution: 'Memorial Hospital',
        department: 'Surgery',
        yearsOfExperience: 15,
        isAvailable: true,
        organSpecialties: ['Kidney', 'Liver'],
        certifications: [
          {
            name: 'Board Certified in General Surgery',
            issuer: 'American Board of Surgery',
            year: 2010,
          },
          {
            name: 'Fellowship in Transplant Surgery',
            issuer: 'Mayo Clinic',
            year: 2012,
          },
        ],
        bio: 'Dr. Smith is a highly experienced transplant surgeon specializing in kidney and liver transplants. With over 15 years of experience, he has performed more than 500 successful transplant procedures.\n\nHe is committed to providing exceptional care to transplant patients and has been recognized for his contributions to the field of transplant medicine.',
        profileImageUrl: 'https://randomuser.me/api/portraits/men/42.jpg',
      },
      {
        id: 2,
        firstName: 'Emily',
        lastName: 'Johnson',
        licenseNumber: 'MD789012',
        specialty: 'Cardiology',
        email: 'emily.johnson@medical.org',
        phone: '(555) 987-6543',
        institution: 'City Medical Center',
        department: 'Cardiology',
        yearsOfExperience: 12,
        isAvailable: true,
        organSpecialties: ['Heart'],
        certifications: [
          {
            name: 'Board Certified in Cardiovascular Disease',
            issuer: 'American Board of Internal Medicine',
            year: 2014,
          },
          {
            name: 'Advanced Cardiac Life Support',
            issuer: 'American Heart Association',
            year: 2020,
          },
        ],
        bio: 'Dr. Johnson is a cardiologist specializing in heart transplants and advanced cardiac care. She has been involved in pioneering research on improving outcomes for heart transplant patients.',
        profileImageUrl: 'https://randomuser.me/api/portraits/women/35.jpg',
      },
    ];

    return doctors.find((doctor) => doctor.id === id) || null;
  }
}
