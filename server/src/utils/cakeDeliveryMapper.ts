/** Maps Mongo `User` records to the cake partner dashboard delivery shape (same fields as client). */

export type ServerCakeStatus =
  | 'Ordered'
  | 'Accepted'
  | 'OutForDelivery'
  | 'Delivered'
  | 'Rejected';

const SERVER_STATUSES: ServerCakeStatus[] = [
  'Ordered',
  'Accepted',
  'OutForDelivery',
  'Delivered',
  'Rejected',
];

export function isServerCakeStatus(value: unknown): value is ServerCakeStatus {
  return typeof value === 'string' && (SERVER_STATUSES as string[]).includes(value);
}

export type ClientCakeDeliveryStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'REJECTED';

/** One ForestGift user = one cake order; stable order id per citizen. */
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
      return 'ACCEPTED';
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
    ACCEPTED: 'Accepted',
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
  cakeStatus?: string;
  token?: string;
};

export function mapUserToDelivery(user: UserFieldsForCakeDelivery) {
  const status = mapServerStatusToClient(user.cakeStatus || 'Ordered');
  const orderId = `FG-${user.id}`;
  const zone = (user.location || '').trim();

  return {
    id: user.id,
    orderId,
    recipientName: user.name,
    dob: user.dob,
    phoneNumber: user.phone,
    deliveryDate: normalizeDeliveryDate(user.date),
    deliveryTime: '12:00',
    /** Full home / mailing line for drop-off */
    location: formatCakeDeliveryHomeLocation(user.address, user.location),
    /** User model `location` — NGO / block / service zone (may overlap home line; shown separately in UI) */
    zoneLocation: zone,
    cakeSize: user.trees >= 7 ? '10 inch' : user.trees >= 4 ? '8 inch' : '6 inch',
    cakeFlavor: 'ForestGift Celebration',
    treeCount: user.trees,
    status,
  };
}
