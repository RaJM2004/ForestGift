/** Maps Mongo `User` records to the cake partner dashboard delivery shape. */

export type ServerCakeStatus =
  | 'Ordered'
  | 'Accepted'
  | 'Preparing'
  | 'OutForDelivery'
  | 'Delivered'
  | 'Rejected';

const SERVER_STATUSES: ServerCakeStatus[] = [
  'Ordered',
  'Accepted',
  'Preparing',
  'OutForDelivery',
  'Delivered',
  'Rejected',
];

export function isServerCakeStatus(value: unknown): value is ServerCakeStatus {
  return typeof value === 'string' && (SERVER_STATUSES as string[]).includes(value);
}

export type ClientCakeDeliveryStatus =
  | 'PENDING'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'REJECTED';

export function formatCakeDeliveryHomeLocation(address: string, location: string): string {
  const a = (address || '').trim();
  const l = (location || '').trim();
  if (!a) return l || '—';
  if (!l || l === 'TBD') return a;
  if (a.includes(l) || l.includes(a)) return a;
  return `${a} — ${l}`;
}

function normalizeDeliveryDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (!Number.isNaN(d.getTime())) {
    return d.toISOString().slice(0, 10);
  }
  return new Date().toISOString().slice(0, 10);
}

export function mapServerStatusToClient(s: string): ClientCakeDeliveryStatus {
  switch (s) {
    case 'Ordered':
      return 'PENDING';
    case 'Accepted':
    case 'Preparing':
      return 'PREPARING';
    case 'OutForDelivery':
      return 'OUT_FOR_DELIVERY';
    case 'Delivered':
      return 'DELIVERED';
    case 'Rejected':
      return 'REJECTED';
    default:
      return 'PENDING';
  }
}

export function mapClientStatusToServer(s: ClientCakeDeliveryStatus): ServerCakeStatus {
  const m: Record<ClientCakeDeliveryStatus, ServerCakeStatus> = {
    PENDING: 'Ordered',
    PREPARING: 'Preparing',
    OUT_FOR_DELIVERY: 'OutForDelivery',
    DELIVERED: 'Delivered',
    REJECTED: 'Rejected',
  };
  return m[s] || 'Ordered';
}

export type UserFieldsForCakeDelivery = {
  id: string;
  name: string;
  dob: string;
  phone: string;
  address: string;
  date: string;
  location: string;
  trees: number;
  amount?: number;
  cakeStatus?: string;
  token?: string;
  updatedAt?: Date;
  createdAt?: Date;
};

export function mapUserToDelivery(user: UserFieldsForCakeDelivery) {
  const status = mapServerStatusToClient(user.cakeStatus || 'Ordered');
  const orderId = `FG-${user.id}`;
  const zone = (user.location || '').trim();
  const deliveryDate = normalizeDeliveryDate(user.date);

  return {
    id: user.id,
    orderId,
    recipientName: user.name,
    dob: user.dob,
    phoneNumber: user.phone,
    deliveryDate,
    deliveryTime: '12:00',
    location: formatCakeDeliveryHomeLocation(user.address, user.location),
    zoneLocation: zone,
    cakeSize: user.trees >= 7 ? '10 inch' : user.trees >= 4 ? '8 inch' : '6 inch',
    cakeFlavor: 'ForestGift Celebration',
    treeCount: user.trees,
    amount: user.amount ?? 0,
    paymentStatus: user.cakeStatus === 'Delivered' ? 'Paid' : 'Pending',
    status,
    statusUpdatedAt: user.updatedAt
      ? new Date(user.updatedAt).toISOString()
      : new Date().toISOString(),
    orderPlacedAt: user.createdAt
      ? new Date(user.createdAt).toISOString()
      : deliveryDate,
  };
}
