const RAW_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || 'http://localhost:5000';
const API_URL = RAW_URL.endsWith('/api') ? RAW_URL : `${RAW_URL}/api`;

export const fetchUsers = async () => {
  const res = await fetch(`${API_URL}/users`);
  return res.json();
};

export const fetchNGOs = async () => {
  const res = await fetch(`${API_URL}/ngos`);
  return res.json();
};

export const fetchNGO = async (id: string) => {
  const res = await fetch(`${API_URL}/ngo/${id}`);
  return res.json();
};

export const updateNGO = async (id: string, data: any) => {
  const res = await fetch(`${API_URL}/ngo/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update NGO');
  }
  return res.json();
};

export const fetchActivities = async () => {
  const res = await fetch(`${API_URL}/activities`);
  return res.json();
};

export const seedDatabase = async () => {
  const res = await fetch(`${API_URL}/seed`, { method: 'POST' });
  return res.json();
};

export const createUser = async (userData: any) => {
  const res = await fetch(`${API_URL}/admin/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create user');
  }
  return res.json();
};

export const assignNGO = async (userId: string, ngoId: string) => {
  const res = await fetch(`${API_URL}/admin/assign-ngo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, ngoId }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to assign NGO');
  }
  return res.json();
};

export const createNGO = async (ngoData: any) => {
  const res = await fetch(`${API_URL}/admin/ngos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ngoData),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create NGO');
  }
  return res.json();
};

export const fetchCakeVendors = async () => {
  const res = await fetch(`${API_URL}/cake/vendors`);
  return res.json();
};

export const createCakeVendor = async (vendorData: any) => {
  const res = await fetch(`${API_URL}/cake/vendors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(vendorData),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create Cake Vendor');
  }
  return res.json();
};

export type ServerCakeDeliveryStatus =
  | 'Ordered'
  | 'Accepted'
  | 'OutForDelivery'
  | 'Delivered'
  | 'Rejected';

export const updateCakeStatus = async (userId: string, status: string, vendorId?: string) => {
  const res = await fetch(`${API_URL}/cake/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, status, vendorId }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update cake status');
  }
  return res.json();
};

export type CakeVendorDeliveryDto = {
  id: string;
  orderId: string;
  recipientName: string;
  dob: string;
  phoneNumber: string;
  deliveryDate: string;
  deliveryTime: string;
  /** Home / formatted drop-off line */
  location: string;
  /** User profile `location` (NGO zone / block / service area) */
  zoneLocation: string;
  cakeSize: string;
  cakeFlavor: string;
  treeCount: number;
  status: string;
};

export type CakeVendorDashboardResponse = {
  vendor: {
    id: string;
    name: string;
    email: string;
    contact: string;
    phone: string;
    area: string;
    costPerCake: number;
  };
  deliveries: CakeVendorDeliveryDto[];
  summary: {
    totalRevenue: number;
    totalTrees: number;
    pendingCount: number;
    activePipelineCount: number;
    deliveredCount: number;
    rejectedCount: number;
    successRate: number;
    monthlyDeliveries: number;
    onTimeDeliveries: number;
    averageRating: number;
    todayIso: string;
  };
};

export const fetchCakeVendorDashboard = async (vendorId: string): Promise<CakeVendorDashboardResponse> => {
  const res = await fetch(`${API_URL}/cake/vendor/${encodeURIComponent(vendorId)}/data`);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to load cake vendor data');
  }
  return res.json();
};

export const fetchCakeVendorCustomers = async (
  vendorId: string,
): Promise<{ deliveries: CakeVendorDeliveryDto[] }> => {
  const res = await fetch(
    `${API_URL}/user/cake-vendor/${encodeURIComponent(vendorId)}/customers`,
  );
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to load cake customers');
  }
  return res.json();
};

export const patchCakeVendorDelivery = async (
  vendorId: string,
  userId: string,
  cakeStatus: ServerCakeDeliveryStatus,
) => {
  const res = await fetch(`${API_URL}/cake/vendor/delivery`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vendorId, userId, cakeStatus }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update delivery');
  }
  return res.json() as Promise<{ delivery: CakeVendorDeliveryDto }>;
};

export const createSubmission = async (submission: any) => {
  const res = await fetch(`${API_URL}/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submission),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create submission');
  }
  return res.json();
};

export const fetchSubmissions = async (ngoId: string) => {
  const res = await fetch(`${API_URL}/submissions/ngo/${encodeURIComponent(ngoId)}`);
  return res.json();
};

export const fetchAllSubmissions = async () => {
  const res = await fetch(`${API_URL}/submissions`);
  return res.json();
};

export const createBulkTreeEntry = async (entry: any) => {
  const res = await fetch(`${API_URL}/bulk-tree-entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create bulk tree entry');
  }
  return res.json();
};

export const fetchBulkTreeEntries = async (ngoId: string) => {
  const res = await fetch(`${API_URL}/bulk-tree-entries/ngo/${encodeURIComponent(ngoId)}`);
  return res.json();
};

export const fetchAllBulkTreeEntries = async () => {
  const res = await fetch(`${API_URL}/bulk-tree-entries`);
  if (!res.ok) throw new Error('Failed to fetch bulk entries');
  return res.json();
};


export const login = async (email: string) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Login failed');
  }
  return res.json();
};


export const createCertificate = async (data: any) => {
  const res = await fetch(`${API_URL}/certificates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create certificate');
  }
  return res.json();
};

export const fetchCertificates = async () => {
  const res = await fetch(`${API_URL}/certificates`);
  return res.json();
};

// Admin CRUD capabilities 
export const deleteUser = async (id: string) => {
  const res = await fetch(`${API_URL}/admin/users/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete user');
  return res.json();
};

export const updateUser = async (id: string, data: any) => {
  const res = await fetch(`${API_URL}/admin/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update user');
  return res.json();
};

export const deleteNGO = async (id: string) => {
  const res = await fetch(`${API_URL}/admin/ngos/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete NGO');
  return res.json();
};

export const updateAdminNGO = async (id: string, data: any) => {
  const res = await fetch(`${API_URL}/admin/ngos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update NGO');
  return res.json();
};

export const deleteCakeVendor = async (id: string) => {
  const res = await fetch(`${API_URL}/admin/vendors/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete Cake Vendor');
  return res.json();
};

export const updateCakeVendor = async (id: string, data: any) => {
  const res = await fetch(`${API_URL}/admin/vendors/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update Cake Vendor');
  return res.json();
};

export const fetchAdminSettings = async () => {
  const res = await fetch(`${API_URL}/admin/settings`);
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
};

export const updateAdminSettings = async (data: any) => {
  const res = await fetch(`${API_URL}/admin/settings`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update settings');
  return res.json();
};

export const resendWelcomeEmail = async (userId: string) => {
  const res = await fetch(`${API_URL}/admin/resend-welcome-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to resend email');
  }
  return res.json();
};

export const getRazorpayKey = async () => {
  const res = await fetch(`${API_URL}/payment/key`);
  return res.json();
};

export const createRazorpayOrder = async (amount: number, receipt?: string) => {
  const res = await fetch(`${API_URL}/payment/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, receipt }),
  });
  return res.json();
};

export const verifyRazorpayPayment = async (data: any) => {
  const res = await fetch(`${API_URL}/payment/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

