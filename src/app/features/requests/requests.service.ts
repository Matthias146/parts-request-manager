import { Injectable, signal } from '@angular/core';
import { SparePartRequest } from '../../core/models/spare-part-request.model';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  private requests = signal<SparePartRequest[]>([
    {
      id: 1,
      partName: 'Brake Pad',
      quantity: 4,
      vehicleModel: 'Toyota Camry',
      priority: 'high',
      status: 'open',
      requestedBy: 'John Doe',
      requestedAt: new Date(),
    },
    {
      id: 2,
      partName: 'Oil Filter',
      quantity: 2,
      vehicleModel: 'Honda Accord',
      priority: 'medium',
      status: 'under_examination',
      requestedBy: 'Jane Smith',
      requestedAt: new Date(),
    },
  ]);

  getAll() {
    return this.requests;
  }

  add(request: SparePartRequest) {
    const current = this.requests();
    this.requests.set([...current, request]);
  }

  updateStatus(id: number, newStatus: SparePartRequest['status']) {
    this.requests.update((requests) =>
      requests.map((req) => (req.id === id ? { ...req, status: newStatus } : req)),
    );
  }
}
