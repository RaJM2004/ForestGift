// Mock data for the delivery dashboard (ForestGift Cake partner)

/** One user (citizen) = one cake order; `location` is formatted home drop-off; `zoneLocation` is profile plantation / block. */
export interface DeliveryRequest {
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
  status: 'PENDING' | 'ACCEPTED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'REJECTED';
  image?: string;
}

export const newDeliveryRequests: DeliveryRequest[] = [
  {
    id: '1',
    orderId: 'FG-2026-001',
    recipientName: 'Sarah Johnson',
    phoneNumber: '+1 (555) 123-4567',
    deliveryDate: '2026-02-18',
    deliveryTime: '14:00',
    location: '123 Oak Street, Downtown',
    cakeSize: '8 inch',
    cakeFlavor: 'Chocolate Truffle',
    treeCount: 3,
    status: 'PENDING',
  },
  {
    id: '2',
    orderId: 'FG-2026-002',
    recipientName: 'Michael Chen',
    phoneNumber: '+1 (555) 234-5678',
    deliveryDate: '2026-02-18',
    deliveryTime: '16:30',
    location: '456 Maple Avenue, Westside',
    cakeSize: '10 inch',
    cakeFlavor: 'Vanilla Rose',
    treeCount: 5,
    status: 'PENDING',
  },
  {
    id: '3',
    orderId: 'FG-2026-003',
    recipientName: 'Emma Davis',
    phoneNumber: '+1 (555) 345-6789',
    deliveryDate: '2026-02-19',
    deliveryTime: '11:00',
    location: '789 Pine Road, Eastside',
    cakeSize: '6 inch',
    cakeFlavor: 'Red Velvet',
    treeCount: 2,
    status: 'PENDING',
  },
];

export const todaysDeliveries: DeliveryRequest[] = [
  {
    id: '4',
    orderId: 'FG-2026-004',
    recipientName: 'James Wilson',
    phoneNumber: '+1 (555) 456-7890',
    deliveryDate: '2026-02-17',
    deliveryTime: '10:00',
    location: '321 Cedar Lane, Northside',
    cakeSize: '8 inch',
    cakeFlavor: 'Strawberry Delight',
    treeCount: 4,
    status: 'OUT_FOR_DELIVERY',
  },
  {
    id: '5',
    orderId: 'FG-2026-005',
    recipientName: 'Olivia Martinez',
    phoneNumber: '+1 (555) 567-8901',
    deliveryDate: '2026-02-17',
    deliveryTime: '13:00',
    location: '654 Birch Street, Southside',
    cakeSize: '12 inch',
    cakeFlavor: 'Lemon Raspberry',
    treeCount: 6,
    status: 'OUT_FOR_DELIVERY',
  },
  {
    id: '6',
    orderId: 'FG-2026-006',
    recipientName: 'Sophia Anderson',
    phoneNumber: '+1 (555) 678-9012',
    deliveryDate: '2026-02-17',
    deliveryTime: '09:00',
    location: '987 Elm Boulevard, Central',
    cakeSize: '8 inch',
    cakeFlavor: 'Chocolate Mint',
    treeCount: 3,
    status: 'DELIVERED',
  },
];

export const allDeliveries: DeliveryRequest[] = [
  ...todaysDeliveries,
  ...newDeliveryRequests,
  {
    id: '7',
    orderId: 'FG-2026-007',
    recipientName: 'Liam Taylor',
    phoneNumber: '+1 (555) 789-0123',
    deliveryDate: '2026-02-16',
    deliveryTime: '15:00',
    location: '147 Willow Way, Harbor',
    cakeSize: '10 inch',
    cakeFlavor: 'Caramel Pecan',
    treeCount: 5,
    status: 'DELIVERED',
  },
  {
    id: '8',
    orderId: 'FG-2026-008',
    recipientName: 'Ava Thompson',
    phoneNumber: '+1 (555) 890-1234',
    deliveryDate: '2026-02-16',
    deliveryTime: '12:00',
    location: '258 Spruce Circle, Marina',
    cakeSize: '6 inch',
    cakeFlavor: 'Blueberry Cream',
    treeCount: 2,
    status: 'DELIVERED',
  },
];

export const performanceStats = {
  monthlyDeliveries: 25,
  successRate: 96,
  averageRating: 4.8,
  totalTrees: 87,
  onTimeDeliveries: 24,
};
