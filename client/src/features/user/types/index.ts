export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  dob?: string;
  address?: string;
  token?: string;
  status: 'Pending' | 'Planted' | 'Growing' | 'Verified';
  referralCount: number;
  globalRank: number;
  trees?: number;
  ngo?: string;
  location?: string;
  rank?: string;
  topPercent?: string;
  referrals?: number;
  earnings?: number;
  referralCode?: string;
  impactPoints?: number;
  rankInfluence?: string;
}

export interface Stats {
  totalTrees: number;
  carbonOffset: string;
  oxygenProduced: string;
  active: number;
  deceased: number;
}

export interface Achievement {
  title: string;
  current: number | string;
  target: number;
  icon: string;
}

export interface Analytics {
  speciesDistribution: { name: string; value: number }[];
  monthlyData: { month: string; trees: number; co2: string }[];
  achievements: Achievement[];
}

export interface TreeEntry {
  _id: string;
  userId?: string;
  userName?: string;
  userToken?: string;
  lat: number;
  lng: number;
  location: string;
  count: number;
  species?: string;
  note?: string;
  images?: string[];
  proofs?: string[];
  health?: number;
  favorite?: boolean;
  createdAt?: string;
}

export interface Order {
  orderId: string;
  _id?: string;
  userId: string;
  trees: number;
  status: string;
  progress: number;
  date: string;
  location: string;
  amount: string;
  species: string;
}

export interface Certificate {
  id: string;
  _id?: string;
  orderId: string;
  userId: string;
  treeCount: number;
  count?: number; // Fallback field
  issuedDate: string;
  location: string;
  verified: boolean;
  createdAt?: string;
}
