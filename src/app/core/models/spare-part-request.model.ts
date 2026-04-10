export type RequestStatus = 'open' | 'under_examination' | 'ordered' | 'closed';

export type Priority = 'low' | 'medium' | 'high';

export interface SparePartRequest {
  id: number;
  partName: string;
  quantity: number;
  vehicleModel: string;
  priority: Priority;
  status: RequestStatus;
  requestedBy: string;
  requestedAt: Date;
}
