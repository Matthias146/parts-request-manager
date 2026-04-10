export type RequestStatus = 'open' | 'under examination' | 'ordered' | 'closed';

export interface SparePartRequest {
  id: number;
  partName: string;
  quantity: number;
  status: RequestStatus;
  requestedBy: string;
  requestedAt: Date;
}
