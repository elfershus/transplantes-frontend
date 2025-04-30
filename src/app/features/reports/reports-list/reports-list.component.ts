import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reports-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-6">Reports</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Transplant Reports Card -->
        <div
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div class="p-6">
            <h2 class="text-xl font-semibold mb-2">Transplant Procedures</h2>
            <p class="text-gray-600 mb-4">
              View statistics and reports on all transplant procedures
              performed.
            </p>
            <button
              routerLink="transplants"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              View Report
            </button>
          </div>
        </div>

        <!-- Donor Reports Card -->
        <div
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div class="p-6">
            <h2 class="text-xl font-semibold mb-2">Donor Statistics</h2>
            <p class="text-gray-600 mb-4">
              Analyze donor demographics, types of organs donated, and outcomes.
            </p>
            <button
              routerLink="donors"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              View Report
            </button>
          </div>
        </div>

        <!-- Receiver Reports Card -->
        <div
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div class="p-6">
            <h2 class="text-xl font-semibold mb-2">Receiver Outcomes</h2>
            <p class="text-gray-600 mb-4">
              Review patient outcomes, waiting times, and success rates.
            </p>
            <button
              routerLink="receivers"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              View Report
            </button>
          </div>
        </div>

        <!-- Organ Utilization Card -->
        <div
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div class="p-6">
            <h2 class="text-xl font-semibold mb-2">Organ Utilization</h2>
            <p class="text-gray-600 mb-4">
              Track organ recovery rates, utilization, and preservation metrics.
            </p>
            <button
              routerLink="organ-utilization"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              View Report
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ReportsListComponent {
  constructor() {}
}
