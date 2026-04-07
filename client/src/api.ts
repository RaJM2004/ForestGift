const API_URL = 'http://localhost:5000/api';

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

export const updateCakeStatus = async (userId: string, status: string) => {
  const res = await fetch(`${API_URL}/cake/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, status }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update cake status');
  }
  return res.json();
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
