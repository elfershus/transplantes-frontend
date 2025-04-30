import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DoctorService } from '../doctor.service';
import { Doctor } from '../doctor.model';

// Extended doctor interface for component-specific properties
interface DoctorExtended extends Doctor {
  department?: string;
  yearsOfExperience?: number;
  isAvailable?: boolean;
  organSpecialties?: string[];
  certifications?: { name: string; issuer: string; year: number }[];
  bio?: string;
  profileImageUrl?: string;
}

@Component({
  selector: 'app-doctor-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
  ],
  templateUrl: './doctor-edit.component.html',
  styleUrls: ['./doctor-edit.component.scss'],
})
export class DoctorEditComponent implements OnInit {
  doctorForm: FormGroup;
  loading = false;
  error: string | null = null;
  submitted = false;
  isNewDoctor = false;
  organOptions = [
    'Heart',
    'Kidney',
    'Liver',
    'Lung',
    'Pancreas',
    'Intestines',
    'Cornea',
    'Bone Marrow',
  ];
  organSpecialties: string[] = [];
  isEditing = false;
  isEditMode = false;
  doctorId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.doctorForm = this.createForm();
  }

  ngOnInit(): void {
    this.doctorId = this.route.snapshot.paramMap.get('id');
    this.isEditing = !!this.doctorId;
    this.isEditMode = !!this.doctorId;

    if (this.isEditing && this.doctorId) {
      this.loadDoctorData(this.doctorId);
    } else {
      this.isNewDoctor = true;
      this.addCertification(); // Add at least one empty certification field
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      specialty: ['', [Validators.required]],
      licenseNumber: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      // Additional form fields for extended properties
      department: [''],
      yearsOfExperience: [0],
      isAvailable: [true],
      bio: [''],
      profileImageUrl: [''],
      certifications: this.fb.array([]),
    });
  }

  loadDoctorData(id: string): void {
    this.loading = true;
    this.doctorService.getDoctorById(id).subscribe({
      next: (doctor) => {
        // First patch the basic doctor properties
        this.doctorForm.patchValue({
          name: doctor.name,
          firstName: doctor.firstName,
          lastName: doctor.lastName,
          specialty: doctor.specialty,
          licenseNumber: doctor.licenseNumber,
          phoneNumber: doctor.phoneNumber,
          phone: doctor.phone,
          email: doctor.email,
        });

        // Then patch any extended properties if they exist on the doctor object
        const doctorExt = doctor as DoctorExtended;
        if (doctorExt.department)
          this.doctorForm.get('department')?.setValue(doctorExt.department);
        if (doctorExt.yearsOfExperience)
          this.doctorForm
            .get('yearsOfExperience')
            ?.setValue(doctorExt.yearsOfExperience);
        if (doctorExt.isAvailable !== undefined)
          this.doctorForm.get('isAvailable')?.setValue(doctorExt.isAvailable);
        if (doctorExt.bio) this.doctorForm.get('bio')?.setValue(doctorExt.bio);
        if (doctorExt.profileImageUrl)
          this.doctorForm
            .get('profileImageUrl')
            ?.setValue(doctorExt.profileImageUrl);

        // Set organ specialties if they exist
        if (
          doctorExt.organSpecialties &&
          doctorExt.organSpecialties.length > 0
        ) {
          this.organSpecialties = [...doctorExt.organSpecialties];
        }

        // Clear and populate certifications array if they exist
        this.certifications.clear();
        if (doctorExt.certifications && doctorExt.certifications.length > 0) {
          doctorExt.certifications.forEach((cert) => {
            this.certifications.push(this.createCertificationGroup(cert));
          });
        } else {
          this.addCertification();
        }

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading doctor data', error);
        this.snackBar.open('Error loading doctor information', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/doctors']);
        this.loading = false;
      },
    });
  }

  get f() {
    return this.doctorForm.controls;
  }

  get certifications() {
    return this.doctorForm.get('certifications') as FormArray;
  }

  createCertificationGroup(cert?: {
    name: string;
    issuer: string;
    year: number;
  }) {
    return this.fb.group({
      name: [cert?.name || '', Validators.required],
      issuer: [cert?.issuer || '', Validators.required],
      year: [cert?.year || new Date().getFullYear(), Validators.required],
    });
  }

  addCertification(): void {
    this.certifications.push(this.createCertificationGroup());
  }

  removeCertification(index: number): void {
    this.certifications.removeAt(index);
  }

  onOrganChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    if (target.checked) {
      if (!this.organSpecialties.includes(value)) {
        this.organSpecialties.push(value);
      }
    } else {
      this.organSpecialties = this.organSpecialties.filter(
        (organ) => organ !== value
      );
    }
  }

  isOrganSelected(organ: string): boolean {
    return this.organSpecialties.includes(organ);
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.doctorForm.invalid || this.organSpecialties.length === 0) {
      return;
    }

    // Create the basic doctor data
    const doctorData: Doctor = {
      name: this.doctorForm.value.name,
      firstName: this.doctorForm.value.firstName,
      lastName: this.doctorForm.value.lastName,
      specialty: this.doctorForm.value.specialty,
      licenseNumber: this.doctorForm.value.licenseNumber,
      phone: this.doctorForm.value.phone,
      phoneNumber: this.doctorForm.value.phoneNumber,
      email: this.doctorForm.value.email,
    };

    // Add extended properties
    const doctorExtData = {
      ...doctorData,
      department: this.doctorForm.value.department,
      yearsOfExperience: this.doctorForm.value.yearsOfExperience,
      isAvailable: this.doctorForm.value.isAvailable,
      bio: this.doctorForm.value.bio,
      profileImageUrl: this.doctorForm.value.profileImageUrl,
      organSpecialties: this.organSpecialties,
      certifications: this.certifications.value,
    };

    if (this.isEditing && this.doctorId) {
      this.doctorService.updateDoctor(this.doctorId, doctorData).subscribe({
        next: () => {
          this.snackBar.open('Doctor updated successfully', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/doctors']);
        },
        error: (error) => {
          this.snackBar.open('Error updating doctor', 'Close', {
            duration: 3000,
          });
          console.error('Error updating doctor:', error);
        },
      });
    } else {
      this.doctorService.createDoctor(doctorData).subscribe({
        next: () => {
          this.snackBar.open('Doctor created successfully', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/doctors']);
        },
        error: (error) => {
          this.snackBar.open('Error creating doctor', 'Close', {
            duration: 3000,
          });
          console.error('Error creating doctor:', error);
        },
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/doctors']);
  }

  // Helper method to trigger validation messages
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  // Mock data helper for demo
  getMockDoctor(id: number): DoctorExtended | null {
    const doctors: DoctorExtended[] = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Smith',
        name: 'John Smith',
        licenseNumber: 'MD123456',
        specialty: 'Transplant Surgery',
        email: 'john.smith@hospital.com',
        phone: '(555) 123-4567',
        phoneNumber: '5551234567',
        institutions: [
          {
            id: 1,
            name: 'Memorial Hospital',
            type: 'Hospital',
            address: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62701',
            country: 'USA',
            phone: '(555) 123-4567',
            email: 'info@memorialhospital.com',
          },
        ],
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
        name: 'Emily Johnson',
        licenseNumber: 'MD789012',
        specialty: 'Cardiology',
        email: 'emily.johnson@medical.org',
        phone: '(555) 987-6543',
        phoneNumber: '5559876543',
        institutions: [
          {
            id: 2,
            name: 'City Medical Center',
            type: 'Hospital',
            address: '456 Oak Ave',
            city: 'Metropolis',
            state: 'NY',
            zipCode: '10001',
            country: 'USA',
            phone: '(555) 987-6543',
            email: 'info@citymedical.com',
          },
        ],
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
