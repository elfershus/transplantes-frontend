// src/app/features/doctors/doctors-list/doctors-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-doctors-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Doctors</h1>
        <button
          routerLink="new"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Doctor
        </button>
      </div>

      <!-- Search & Filter -->
      <div class="bg-white p-4 rounded shadow mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="md:w-1/3">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Search</label
            >
            <input
              [(ngModel)]="searchTerm"
              (input)="applyFilters()"
              type="text"
              placeholder="Search by name or specialty..."
              class="w-full p-2 border rounded"
            />
          </div>

          <div class="md:w-1/3">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Specialty</label
            >
            <select
              [(ngModel)]="selectedSpecialty"
              (change)="applyFilters()"
              class="w-full p-2 border rounded"
            >
              <option value="">All Specialties</option>
              <option value="Transplant Surgery">Transplant Surgery</option>
              <option value="Nephrology">Nephrology</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Hepatology">Hepatology</option>
              <option value="Pulmonology">Pulmonology</option>
            </select>
          </div>

          <div class="md:w-1/3">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Institution</label
            >
            <select
              [(ngModel)]="selectedInstitution"
              (change)="applyFilters()"
              class="w-full p-2 border rounded"
            >
              <option value="">All Institutions</option>
              <option value="Memorial Hospital">Memorial Hospital</option>
              <option value="University Medical Center">
                University Medical Center
              </option>
              <option value="Central Hospital">Central Hospital</option>
              <option value="Regional Medical Center">
                Regional Medical Center
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading Indicator -->
      <div *ngIf="loading" class="flex justify-center my-10">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
        ></div>
      </div>

      <!-- No Results Message -->
      <div
        *ngIf="!loading && filteredDoctors.length === 0"
        class="bg-white p-10 rounded shadow text-center"
      >
        <p class="text-gray-500">No doctors found matching your criteria.</p>
      </div>

      <!-- Doctors List -->
      <div
        *ngIf="!loading && filteredDoctors.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          *ngFor="let doctor of filteredDoctors"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div class="p-4">
            <div class="flex items-center gap-4 mb-4">
              <div
                class="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-2xl font-bold"
              >
                {{ doctor.firstName.charAt(0) }}{{ doctor.lastName.charAt(0) }}
              </div>
              <div>
                <h2 class="text-xl font-semibold">
                  Dr. {{ doctor.firstName }} {{ doctor.lastName }}
                </h2>
                <p class="text-blue-600">{{ doctor.specialty }}</p>
              </div>
            </div>

            <div class="mb-4">
              <p class="text-gray-600 mb-1">
                <span class="font-medium">Institution:</span>
                {{ doctor.institution }}
              </p>
              <p class="text-gray-600 mb-1">
                <span class="font-medium">License #:</span>
                {{ doctor.licenseNumber }}
              </p>
              <p class="text-gray-600">
                <span class="font-medium">Procedures:</span>
                {{ doctor.proceduresCount }}
              </p>
            </div>

            <div class="flex justify-between mt-4">
              <button
                [routerLink]="[doctor.id]"
                class="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded"
              >
                View Details
              </button>
              <button
                [routerLink]="[doctor.id, 'edit']"
                class="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-3 rounded"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DoctorsListComponent implements OnInit {
  doctors: any[] = [];
  filteredDoctors: any[] = [];
  loading = false;

  searchTerm = '';
  selectedSpecialty = '';
  selectedInstitution = '';

  // Mock data for demonstration
  mockDoctors = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Smith',
      specialty: 'Transplant Surgery',
      institution: 'Memorial Hospital',
      licenseNumber: 'MD-12345',
      proceduresCount: 127,
    },
    {
      id: 2,
      firstName: 'Sarah',
      lastName: 'Johnson',
      specialty: 'Nephrology',
      institution: 'University Medical Center',
      licenseNumber: 'MD-23456',
      proceduresCount: 84,
    },
    {
      id: 3,
      firstName: 'Robert',
      lastName: 'Williams',
      specialty: 'Cardiology',
      institution: 'Central Hospital',
      licenseNumber: 'MD-34567',
      proceduresCount: 63,
    },
    {
      id: 4,
      firstName: 'Maria',
      lastName: 'Garcia',
      specialty: 'Hepatology',
      institution: 'Regional Medical Center',
      licenseNumber: 'MD-45678',
      proceduresCount: 92,
    },
    {
      id: 5,
      firstName: 'James',
      lastName: 'Brown',
      specialty: 'Transplant Surgery',
      institution: 'Memorial Hospital',
      licenseNumber: 'MD-56789',
      proceduresCount: 118,
    },
    {
      id: 6,
      firstName: 'Emily',
      lastName: 'Davis',
      specialty: 'Pulmonology',
      institution: 'University Medical Center',
      licenseNumber: 'MD-67890',
      proceduresCount: 75,
    },
  ];

  constructor() {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.loading = true;

    // Simulate API call with delay
    setTimeout(() => {
      // In a real application, this would call the API service:
      // this.doctorService.getAllDoctors().subscribe(...)
      this.doctors = this.mockDoctors;
      this.filteredDoctors = [...this.doctors];
      this.loading = false;
    }, 1000);
  }

  applyFilters(): void {
    this.filteredDoctors = this.doctors.filter((doctor) => {
      const matchesSearch =
        this.searchTerm === '' ||
        doctor.firstName
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        doctor.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesSpecialty =
        this.selectedSpecialty === '' ||
        doctor.specialty === this.selectedSpecialty;

      const matchesInstitution =
        this.selectedInstitution === '' ||
        doctor.institution === this.selectedInstitution;

      return matchesSearch && matchesSpecialty && matchesInstitution;
    });
  }
}
