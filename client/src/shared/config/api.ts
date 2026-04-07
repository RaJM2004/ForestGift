export const API_BASE_URL = (import.meta.env as any).VITE_API_URL || 'http://localhost:5000';
export const API_ENDPOINTS = {
  USER_IMPACT: (userId: string) => `${API_BASE_URL}/api/user/${userId}/impact`,
  CERTIFICATES: `${API_BASE_URL}/api/certificates`,
  ORDERS: (userId: string) => `${API_BASE_URL}/api/orders/${userId}`,
  SUBMISSIONS: `${API_BASE_URL}/api/submissions`,
  BULK_ENTRIES: `${API_BASE_URL}/api/bulk-tree-entries`,
  UPDATE_PASSWORD: `${API_BASE_URL}/api/user/update-password`,
  TOGGLE_FAVORITE: `${API_BASE_URL}/api/user/impact/favorite`,
  USER_REFERRALS: (userId: string) => `${API_BASE_URL}/api/user/${userId}/referrals`,
};
