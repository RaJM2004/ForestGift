import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, TreeEntry, Certificate, Order, Stats, Analytics } from '../types';
import { API_ENDPOINTS } from '../../../shared/config/api';

interface UserContextType {
  user: User | null;
  treeEntries: TreeEntry[];
  certificates: Certificate[];
  orders: Order[];
  stats: Stats | null;
  analytics: Analytics | null;
  loading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refreshData: () => void;
  toggleFavorite: (entryId: string, type: 'bulk' | 'submission') => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode; initialUser: any }> = ({ children, initialUser }) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const [treeEntries, setTreeEntries] = useState<TreeEntry[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    if (!initialUser) return;
    setIsRefreshing(true);
    try {
      const userId = initialUser.id || initialUser._id;
      
      const impactsRaw = await fetch(API_ENDPOINTS.USER_IMPACT(userId));
      const impactData = await impactsRaw.json();
      
      if (impactData.user) setUser(impactData.user);
      setTreeEntries(impactData.treeEntries || []);
      setOrders(impactData.orders || []);
      setStats(impactData.stats || null);
      setAnalytics(impactData.analytics || null);

      const certsRaw = await fetch(API_ENDPOINTS.CERTIFICATES);
      const certData = await certsRaw.json();
      const myCerts = (certData || []).filter((c: any) => 
        c.userId === userId || (c.orderId && c.orderId.includes(userId))
      );
      setCertificates(myCerts);
      
      setError(null);
    } catch (err: any) {
      console.warn("Soft data refresh failed:", err.message);
      setError("Synchronication failed. The ForestGift server (Port 5000) might be down.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const toggleFavorite = async (entryId: string, type: 'bulk' | 'submission') => {
    try {
      // Optimistic Update
      setTreeEntries(prev => prev.map(t => 
        t._id === entryId ? { ...t, favorite: !t.favorite } : t
      ));

      const res = await fetch(API_ENDPOINTS.TOGGLE_FAVORITE, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryId, type })
      });

      if (!res.ok) throw new Error("Cloud update failed");
    } catch (err: any) {
      console.error("Favorite sync failed:", err);
      // Rollback on failure
      refreshData();
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <UserContext.Provider value={{ user, treeEntries, certificates, orders, stats, analytics, loading, isRefreshing, error, refreshData, toggleFavorite }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
