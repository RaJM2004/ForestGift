export type DeliveryStatus =
  | 'PENDING'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'REJECTED';

export type DeliveryRequest = {
  id: string;
  orderId: string;
  recipientName: string;
  dob?: string;
  phoneNumber: string;
  deliveryDate: string;
  deliveryTime: string;
  location: string;
  zoneLocation?: string;
  cakeSize: string;
  cakeFlavor: string;
  treeCount: number;
  amount?: number;
  status: DeliveryStatus;
  statusUpdatedAt?: string;
  orderPlacedAt?: string;
};

export type WorkflowAction =
  | 'accept'
  | 'reject'
  | 'preparing'
  | 'out_for_delivery'
  | 'complete_delivery';
