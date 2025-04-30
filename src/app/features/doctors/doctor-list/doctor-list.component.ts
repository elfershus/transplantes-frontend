import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  specialty: string;
  institution: string;
  organSpecialties: string[];
  isAvailable: boolean;
  yearsOfExperience: number;
}

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Doctors</h1>
        <button
          (click)="navigateToAdd()"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Doctor
        </button>
      </div>

      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="flex flex-col md:flex-row gap-4 mb-4">
          <!-- Search -->
          <div class="md:w-1/3">
            <label
              for="search"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Search</label
            >
            <input
              type="text"
              id="search"
              [formControl]="searchControl"
              placeholder="Search by name or specialty..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <!-- Specialty Filter -->
          <div class="md:w-1/3">
            <label
              for="specialty"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Specialty</label
            >
            <select
              id="specialty"
              [formControl]="specialtyControl"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Specialties</option>
              <option *ngFor="let specialty of specialties" [value]="specialty">
                {{ specialty }}
              </option>
            </select>
          </div>

          <!-- Organ Filter -->
          <div class="md:w-1/3">
            <label
              for="organ"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Organ Specialty</label
            >
            <select
              id="organ"
              [formControl]="organControl"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Organs</option>
              <option *ngFor="let organ of organTypes" [value]="organ">
                {{ organ }}
              </option>
            </select>
          </div>
        </div>

        <div class="flex justify-between items-center mb-2">
          <div class="flex gap-4">
            <button
              (click)="toggleAvailabilityFilter(true)"
              class="px-3 py-1 rounded-full text-sm"
              [ngClass]="
                availabilityFilter === true
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
              "
            >
              Available
            </button>
            <button
              (click)="toggleAvailabilityFilter(false)"
              class="px-3 py-1 rounded-full text-sm"
              [ngClass]="
                availabilityFilter === false
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
              "
            >
              Not Available
            </button>
            <button
              (click)="toggleAvailabilityFilter(null)"
              class="px-3 py-1 rounded-full text-sm"
              [ngClass]="
                availabilityFilter === null
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
              "
            >
              All
            </button>
          </div>

          <div class="text-sm text-gray-500">
            {{ filteredDoctors.length }} doctor{{
              filteredDoctors.length !== 1 ? 's' : ''
            }}
            found
          </div>
        </div>
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
        *ngIf="!loading && filteredDoctors.length === 0"
        class="text-center my-10"
      >
        <p class="text-gray-500">No doctors found matching your criteria.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          *ngFor="let doctor of filteredDoctors"
          class="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-200"
        >
          <div class="p-6">
            <div class="flex justify-between items-start">
              <div>
                <h2 class="text-xl font-semibold mb-1">
                  Dr. {{ doctor.firstName }} {{ doctor.lastName }}
                </h2>
                <p class="text-gray-600 mb-3">{{ doctor.specialty }}</p>
              </div>
              <span
                class="px-2 py-1 text-xs rounded-full"
                [ngClass]="
                  doctor.isAvailable
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                "
              >
                {{ doctor.isAvailable ? 'Available' : 'Unavailable' }}
              </span>
            </div>

            <div class="border-t border-gray-100 pt-3 mb-3">
              <p class="text-gray-600 text-sm">{{ doctor.institution }}</p>
              <p class="text-gray-500 text-sm">
                {{ doctor.yearsOfExperience }} years experience
              </p>
            </div>

            <div class="mb-4">
              <div class="flex flex-wrap gap-1 mt-1">
                <span
                  *ngFor="let organ of doctor.organSpecialties"
                  class="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded"
                >
                  {{ organ }}
                </span>
              </div>
            </div>

            <div class="flex justify-between mt-4">
              <button
                (click)="navigateToDetails(doctor.id)"
                class="text-blue-600 hover:text-blue-800 font-medium"
              >
                View Details
              </button>
              <div class="flex gap-2">
                <button
                  (click)="navigateToEdit(doctor.id)"
                  class="text-gray-600 hover:text-gray-800"
                >
                  Edit
                </button>
                <button
                  (click)="deleteDoctor(doctor.id)"
                  class="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DoctorListComponent implements OnInit {
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  loading = false;
  error: string | null = null;

  searchControl = new FormControl('');
  specialtyControl = new FormControl('');
  organControl = new FormControl('');
  availabilityFilter: boolean | null = null;

  specialties: string[] = [];
  organTypes = [
    'Kidney',
    'Liver',
    'Heart',
    'Lung',
    'Pancreas',
    'Intestine',
    'Cornea',
    'Bone Marrow',
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadDoctors();

    // Subscribe to filter changes
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.applyFilters());

    this.specialtyControl.valueChanges.subscribe(() => this.applyFilters());
    this.organControl.valueChanges.subscribe(() => this.applyFilters());
  }

  loadDoctors(): void {
    this.loading = true;

    // In a real application, this would call the API service
    // this.doctorService.getDoctors().subscribe(...)
    setTimeout(() => {
      this.doctors = this.getMockDoctors();
      this.filteredDoctors = [...this.doctors];

      // Extract unique specialties for the filter dropdown
      this.specialties = Array.from(
        new Set(this.doctors.map((doctor) => doctor.specialty))
      );

      this.loading = false;
    }, 1000);
  }

  applyFilters(): void {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    const specialty = this.specialtyControl.value || '';
    const organ = this.organControl.value || '';

    this.filteredDoctors = this.doctors.filter((doctor) => {
      // Search filter
      const matchesSearch =
        !searchTerm ||
        doctor.firstName.toLowerCase().includes(searchTerm) ||
        doctor.lastName.toLowerCase().includes(searchTerm) ||
        doctor.specialty.toLowerCase().includes(searchTerm);

      // Specialty filter
      const matchesSpecialty = !specialty || doctor.specialty === specialty;

      // Organ filter
      const matchesOrgan = !organ || doctor.organSpecialties.includes(organ);

      // Availability filter
      const matchesAvailability =
        this.availabilityFilter === null ||
        doctor.isAvailable === this.availabilityFilter;

      return (
        matchesSearch && matchesSpecialty && matchesOrgan && matchesAvailability
      );
    });
  }

  toggleAvailabilityFilter(value: boolean | null): void {
    this.availabilityFilter = value;
    this.applyFilters();
  }

  navigateToAdd(): void {
    this.router.navigate(['/doctors/new']);
  }

  navigateToDetails(id: number): void {
    this.router.navigate(['/doctors', id]);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/doctors', id, 'edit']);
  }

  deleteDoctor(id: number): void {
    if (confirm('Are you sure you want to delete this doctor?')) {
      // In a real application, this would call the API service
      // this.doctorService.deleteDoctor(id).subscribe(...)

      this.doctors = this.doctors.filter((doctor) => doctor.id !== id);
      this.applyFilters();
    }
  }

  // Mock data helper for demo
  getMockDoctors(): Doctor[] {
    return [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Smith',
        specialty: 'Transplant Surgery',
        institution: 'Memorial Hospital',
        organSpecialties: ['Kidney', 'Liver'],
        isAvailable: true,
        yearsOfExperience: 15,
      },
      {
        id: 2,
        firstName: 'Emily',
        lastName: 'Johnson',
        specialty: 'Cardiology',
        institution: 'City Medical Center',
        organSpecialties: ['Heart'],
        isAvailable: true,
        yearsOfExperience: 12,
      },
      {
        id: 3,
        firstName: 'Michael',
        lastName: 'Williams',
        specialty: 'Nephrology',
        institution: 'University Hospital',
        organSpecialties: ['Kidney'],
        isAvailable: false,
        yearsOfExperience: 8,
      },
      {
        id: 4,
        firstName: 'Sarah',
        lastName: 'Davis',
        specialty: 'Hepatology',
        institution: 'Memorial Hospital',
        organSpecialties: ['Liver'],
        isAvailable: true,
        yearsOfExperience: 10,
      },
      {
        id: 5,
        firstName: 'Robert',
        lastName: 'Miller',
        specialty: 'Pulmonology',
        institution: 'Regional Medical Center',
        organSpecialties: ['Lung'],
        isAvailable: false,
        yearsOfExperience: 14,
      },
      {
        id: 6,
        firstName: 'Jennifer',
        lastName: 'Wilson',
        specialty: 'Transplant Surgery',
        institution: 'University Hospital',
        organSpecialties: ['Kidney', 'Pancreas', 'Intestine'],
        isAvailable: true,
        yearsOfExperience: 18,
      },
    ];
  }
}
