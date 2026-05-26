import React, { useState, useEffect, useMemo, useRef } from 'react';
import { DashboardLayout } from '../../shared/layouts/DashboardLayout';
import { Badge, Icon, StatCard } from '../../shared/components/UI';
import { fetchUsers, fetchNGOs, fetchActivities, createUser, assignNGO, createNGO, fetchCakeVendors, createCakeVendor, updateCakeStatus, fetchAllSubmissions, createCertificate, fetchCertificates, fetchAllBulkTreeEntries, deleteUser, updateUser, deleteNGO, updateAdminNGO, deleteCakeVendor, updateCakeVendor, fetchAdminSettings, updateAdminSettings, resendWelcomeEmail, fetchStories, createStory, deleteStory } from '../../api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { CertificateModal } from './CertificateModal';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const getOffset = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return { lat: (hash % 100) / 10000, lng: ((hash >> 4) % 100) / 10000 };
};

const getCakeVendor = (location: string, vendorList: any[]) => {
  const vendor = vendorList.find(v => v.area === location);
  if (vendor) return vendor;

  const fallbackVendors: Record<string, string> = {
    'Satellite Block A': 'Indore Cake Masters',
    'Satellite Block B': 'City Bakers NGO',
    'Narmada Zone': 'Jabalpur Cake Factory',
    'Satpura Zone': 'Bhopal Bakeries',
    'Malwa Zone': 'Ujjain Sweets',
    'Central Zone': 'Capital Patisserie'
  };
  return { name: fallbackVendors[location] || 'Regional State Bakers', costPerCake: 500 };
};

/** Vendor id for API/DB; only real vendors (matched by service area) get an id. */
const resolveCakeVendorId = (location: string, vendorList: any[]) => {
  const vendor = vendorList.find((v) => v.area === location);
  return vendor?.id ?? 'Unassigned';
};

const getDisplayedCakeVendor = (u: any, vendorList: any[]) => {
  const id = u.cakeVendor && u.cakeVendor !== 'Unassigned' ? u.cakeVendor : null;
  if (id) {
    const match = vendorList.find((v) => v.id === id);
    if (match) return { name: match.name, costPerCake: match.costPerCake };
  }
  return getCakeVendor(u.location || 'Satellite Block A', vendorList);
};


export const AdminDashboard = ({ handleLogout }: { handleLogout?: () => void }) => {
  const [activeSection, setActiveSection] = useState("Dashboard Overview");
  const [users, setUsers] = useState<any[]>([]);
  const [ngos, setNgos] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [cakeVendors, setCakeVendors] = useState<any[]>([]);
  const [treeEntries, setTreeEntries] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [showAddStoryModal, setShowAddStoryModal] = useState(false);
  const [storyFormData, setStoryFormData] = useState({ title: '', content: '', imageUrl: '', linkUrl: '' });
  const [ngoFilter, setNgoFilter] = useState("All NGOs");
  const [userSearch, setUserSearch] = useState("");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [mapRef, setMapRef] = useState<any>(null);
  const [selectedCertificateUser, setSelectedCertificateUser] = useState<any>(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddNgoModal, setShowAddNgoModal] = useState(false);
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedNgoId, setSelectedNgoId] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dob: '',
    amount: 1000,
    trees: 1,
    ngo: 'Not Assigned',
    location: 'Satellite Block A',
  });
  const [ngoFormData, setNgoFormData] = useState({
    name: '',
    reg: '',
    contact: '',
    phone: '',
    email: '',
    area: 'Central Zone',
  });
  const [vendorFormData, setVendorFormData] = useState({
    name: '', email: '', contact: '', phone: '', area: 'Satellite Block A', costPerCake: 500
  });
  const [bulkDataPreview, setBulkDataPreview] = useState<any[] | null>(null);
  const [bulkImportStatus, setBulkImportStatus] = useState<any | null>(null);
  const [roleManageTab, setRoleManageTab] = useState<'users' | 'ngos' | 'vendors'>('users');
  const [editingRoleItem, setEditingRoleItem] = useState<{type: 'user' | 'ngo' | 'vendor', data: any} | null>(null);
  const [deleteConfirmationItem, setDeleteConfirmationItem] = useState<{type: string, id: string} | null>(null);

  const [adminSettings, setAdminSettings] = useState<any>(null);
  const [localSettingsForm, setLocalSettingsForm] = useState<any>({ platformName: '', supportEmail: '', supportPhone: '', treeUnitPrice: 0, maintenanceMode: false });
  const [savingSettings, setSavingSettings] = useState(false);

  // NGO Color Palette for map segregation
  const ngoColorMap = useMemo(() => {
    const colors = ['#059669', '#2563eb', '#7c3aed', '#db2777', '#ea580c', '#0891b2', '#4f46e5'];
    const map: Record<string, string> = { 'All NGOs': '#000000' };
    ngos.forEach((n, i) => {
      map[n.name] = colors[i % colors.length];
      map[n.id] = colors[i % colors.length];
    });
    return map;
  }, [ngos]);

  // Derived/Enriched Data for real-time submission tracking
  const enrichedNgos = useMemo(() => {
    return ngos.map(n => {
      const normalizedNgoId = n.id?.toLowerCase();
      const normalizedNgoName = n.name?.toLowerCase();
      
      const ngoSubmissions = submissions.filter(s => {
        const sid = s.ngoId?.toLowerCase();
        return sid === normalizedNgoId || sid === normalizedNgoName;
      });
      
      const completedCount = ngoSubmissions.reduce((sum, s) => sum + (Number(s.count) || 0), 0);
      return {
        ...n,
        completed: completedCount,
        pending: Math.max(0, (Number(n.assigned) || 0) - completedCount),
      };
    });
  }, [ngos, submissions]);

  const enrichedUsers = useMemo(() => {
    return users.map(u => {
      const normalizedUserId = u.id?.trim().toLowerCase();
      const normalizedToken = u.token?.trim().toLowerCase();
      const normalizedName = u.name?.trim().toLowerCase();
      
      const userSubmission = submissions.find(s => {
        const sid = s.userId?.trim().toLowerCase();
        const stoken = s.orderId?.trim().toLowerCase();
        return (sid && (sid === normalizedUserId || sid === normalizedToken || sid === normalizedName)) || 
               (stoken && (stoken === normalizedUserId || stoken === normalizedToken || stoken === normalizedName));
      });
      
      return {
        ...u,
        status: userSubmission ? "Planted" : u.status,
      };
    });
  }, [users, submissions]);

  const refreshData = () => {
    Promise.all([
      fetchUsers(), 
      fetchNGOs(), 
      fetchActivities(), 
      fetchCakeVendors(), 
      fetchAllSubmissions(), 
      fetchAllBulkTreeEntries(), 
      fetchAdminSettings(),
      fetchCertificates(),
      fetchStories()
    ])
      .then(([u, n, a, cv, s, te, as, certs, st]) => {
        console.log("SYNC SUCCESS:", { 
          users: u?.length || 0, 
          ngos: n?.length || 0, 
          submissions: s?.length || 0,
          treeEntries: te?.length || 0,
          certificates: certs?.length || 0,
          stories: st?.length || 0
        });
        
        setUsers(Array.isArray(u) ? u : []);
        setNgos(Array.isArray(n) ? n : []);
        setActivities(Array.isArray(a) ? a : []);
        setCakeVendors(Array.isArray(cv) ? cv : []);
        setSubmissions(Array.isArray(s) ? s : []);
        setTreeEntries(Array.isArray(te) ? te : []);
        setCertificates(Array.isArray(certs) ? certs : []);
        setStories(Array.isArray(st) ? st : []);
        setLastUpdated(new Date());

        if (as && !adminSettings) {
          setAdminSettings(as);
          setLocalSettingsForm({
             platformName: as.platformName || '',
             supportEmail: as.supportEmail || '',
             supportPhone: as.supportPhone || '',
             treeUnitPrice: as.treeUnitPrice || 0,
             maintenanceMode: as.maintenanceMode || false,
          });
        }
      })
      .catch(err => {
        console.error("SYNC FAILED:", err);
      });
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 10000); // 10 second polling for "real-time"
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeSection === "Tree Map" && mapRef) {
      setTimeout(() => {
        mapRef.invalidateSize();
        // Force a slight state touch to ensure markers are up to date
        console.log("Map invalidated for real-time visualization");
      }, 250);
    }
  }, [activeSection, mapRef, submissions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUser({
        ...formData,
        cakeVendor: resolveCakeVendorId(formData.location, cakeVendors),
        cakeStatus: 'Ordered',
      });
      toast.success("Citizen Registered Successfully! ID and Token generated.");
      setShowAddModal(false);
      refreshData();
      setFormData({
        name: '', email: '', phone: '', address: '', dob: '',
        amount: 1000, trees: 1, ngo: 'Not Assigned', location: 'Satellite Block A',
      });
    } catch (error: any) {
      console.error("Submission Error:", error);
      toast.error(error.message || "Error adding user");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

      const validatedData = jsonData.map(row => {
        let amount = parseInt(row.Amount || row.amount || row.AMOUNT) || 1000;
        const location = row.Location || row.location || row.LOCATION || 'Satellite Block A';
        return {
          name: row.Name || row.name || row.NAME || 'Citizen',
          email: row.Email || row.email || row.EMAIL || `citizen${Math.floor(Math.random()*10000)}@example.com`,
          phone: String(row.Phone || row.phone || row.PHONE || ''),
          address: row.Address || row.address || row.ADDRESS || 'Unknown',
          dob: row.DOB || row.dob || new Date().toISOString().split('T')[0],
          amount: amount,
          trees: Math.floor(amount / 1000) || 1,
          ngo: 'Not Assigned',
          location,
          cakeVendor: resolveCakeVendorId(location, cakeVendors),
          cakeStatus: 'Ordered',
        };
      });

      setBulkDataPreview(validatedData);
    } catch (error) {
      console.error(error);
      toast.error("Error parsing or uploading file. Ensure it's a valid CSV/Excel format.");
    } finally {
      e.target.value = ''; // reset file input
      setLoading(false);
    }
  };

  const confirmBulkImport = async () => {
    if (!bulkDataPreview) return;
    setLoading(true);
    let successCount = 0;
    try {
      for (const payload of bulkDataPreview) {
        try {
          await createUser(payload);
          successCount++;
        } catch(err) {
          console.error("Failed to insert bulk user:", payload, err);
        }
      }
      setBulkImportStatus({ success: successCount, total: bulkDataPreview.length });
      refreshData();
    } catch(err) {
      console.error(err);
      toast.error("Error during bulk import execution.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitNgo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createNGO(ngoFormData);
      toast.success("NGO Registered Successfully!");
      setShowAddNgoModal(false);
      refreshData();
      setNgoFormData({
        name: '', reg: '', contact: '', phone: '', email: '', area: 'Central Zone',
      });
    } catch (error: any) {
      console.error("NGO Submission Error:", error);
      toast.error(error.message || "Error adding NGO");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedNgoId) return;
    setLoading(true);
    try {
      await assignNGO(selectedUser.id, selectedNgoId);
      toast.success("Order assigned successfully!");
      setShowAssignModal(false);
      setSelectedUser(null);
      setSelectedNgoId("");
      refreshData();
    } catch (error) {
      toast.error("Error assigning NGO");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCakeVendor(vendorFormData);
      toast.success("Cake Vendor Registered Successfully!");
      setShowAddVendorModal(false);
      refreshData();
      setVendorFormData({
        name: '', email: '', contact: '', phone: '', area: 'Satellite Block A', costPerCake: 500
      });

    } catch (error: any) {
      console.error("Vendor Submission Error:", error);
      toast.error(error.message || "Error adding Vendor");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDelivered = async (userId: string) => {
    setLoading(true);
    try {
      await updateCakeStatus(userId, 'Delivered');
      refreshData();
    } catch (error: any) {
      console.error("Status Update Error:", error);
      toast.error(error.message || "Error updating status");
    } finally {
      setLoading(false);
    }
  };

  const executeDeleteRoleItem = async () => {
    if(!deleteConfirmationItem) return;
    const { type, id } = deleteConfirmationItem;
    setLoading(true);
    try {
      if (type === 'user') await deleteUser(id);
      else if (type === 'ngo') await deleteNGO(id);
      else if (type === 'vendor') await deleteCakeVendor(id);
      toast.success(`${type} deleted successfully.`);
      refreshData();
      setDeleteConfirmationItem(null);
    } catch (e: any) {
      toast.error(e.message || `Failed to delete ${type}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoleItem = (type: string, id: string) => {
    setDeleteConfirmationItem({type, id});
  };

  const handleUpdateRoleItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!editingRoleItem) return;
    setLoading(true);
    const { type, data } = editingRoleItem;
    try {
      if (type === 'user') await updateUser(data.id, data);
      else if (type === 'ngo') await updateAdminNGO(data.id, data);
      else if (type === 'vendor') await updateCakeVendor(data.id, data);
      toast.success(`${type} updated successfully.`);
      setEditingRoleItem(null);
      refreshData();
    } catch (e: any) {
      toast.error(e.message || `Failed to update ${type}`);
    } finally {
      setLoading(false);
    }
  };
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const updated = await updateAdminSettings(localSettingsForm);
      setAdminSettings(updated);
      toast.success('Core Framework Settings updated successfully.');
    } catch (err: any) {
      toast.error(err.message || 'Error updating settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const navItems = [
    { label: "Dashboard Overview", icon: "dashboard" },
    { label: "User Management", icon: "users" },
    { label: "NGO Management", icon: "ngo" },
    { label: "Cake Management", icon: "cake" },
    { label: "Tree Map", icon: "map" },
    { label: "Reports & Analytics", icon: "reports" },
    { label: "Stories Management", icon: "reports" },
    { label: "Role Management", icon: "roles" },
    { label: "Settings", icon: "settings" },
  ];

  const unassignedUsers = users.filter(u => u.ngo === 'Not Assigned');

  return (
    <DashboardLayout 
      title="FORESTGIFT" 
      navItems={navItems} 
      activeSection={activeSection} 
      setActiveSection={setActiveSection}
      lastUpdated={lastUpdated}
      notifications={activities}
      onLogout={handleLogout}
    >
      {activeSection === "Dashboard Overview" && (() => {
        const totalTreesPlanted = submissions.reduce((sum, s) => sum + (s.count || 0), 0);
        const totalContributed = enrichedUsers.reduce((sum, u) => sum + u.amount, 0);
        
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Real-time Data Active</span>
              </div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Last Sync: {lastUpdated.toLocaleTimeString()}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard label="Total Citizens" value={enrichedUsers.length} icon="users" colorClass="bg-gray-100 text-black border border-gray-200" trend="+12.4%" />
              <StatCard label="Registered NGOs" value={enrichedNgos.length} icon="ngo" colorClass="bg-gray-100 text-black border border-gray-200" />
              <StatCard label="Trees Planted" value={totalTreesPlanted.toLocaleString()} icon="tree" colorClass="bg-gray-100 text-black border border-gray-200" trend="+4.2%" />
              <StatCard label="Total Impact (₹)" value={`₹${totalContributed.toLocaleString()}`} icon="finance" colorClass="bg-gray-100 text-black border border-gray-200" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-black text-gray-900 mb-6">NGO Delivery Performance</h3>
                <div className="space-y-5">
                  {enrichedNgos.map(n => {
                    const progress = n.assigned > 0 ? Math.round((n.completed / n.assigned) * 100) : 0;
                    return (
                      <div key={n.id} className="group">
                        <div className="flex justify-between items-end mb-1.5 p-1">
                          <div>
                            <span className="text-sm font-black text-black group-hover:text-gray-700 transition-colors uppercase tracking-widest">{n.name}</span>
                            <span className="text-[9px] text-gray-400 ml-2 font-bold">{n.area}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-black text-black">{n.completed}/{n.assigned}</span>
                            <span className="text-[9px] text-emerald-500 ml-2 font-black">+{progress}%</span>
                          </div>
                        </div>
                        <div className="h-2 w-full bg-gray-50 rounded-full border border-gray-100 overflow-hidden shadow-inner">
                          <div 
                            className="h-full bg-black transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-black rounded-2xl p-6 text-white overflow-hidden shadow-xl flex flex-col h-[400px] relative border border-gray-800">
                 {/* Organic realistic tree silhouette in terminal background */}
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none">
                   <svg width={250} height={250} viewBox="0 0 100 100" fill="currentColor">
                     <path d="M50 98V75 M50 85 L44 78 M50 82 L56 75 M50 75 L40 65 M50 72 L62 60" stroke="white" strokeWidth="2" fill="none" />
                     <path d="M50 2C50 2 25 15 22 45C20 75 50 92 50 92C50 92 80 75 78 45C75 15 50 2 50 2Z" fill="white" opacity="0.15" />
                     <path d="M50 12C50 12 30 25 28 48C26 70 50 85 50 85C50 85 74 70 72 48C70 25 50 12 50 12Z" fill="white" opacity="0.25" />
                   </svg>
                 </div>
                 <h3 className="font-bold mb-6 flex justify-between items-center border-b border-white/10 pb-4 relative z-10">
                   <div className="flex items-center gap-2">
                     <Icon name="activity" size={18} className="text-gray-300" />
                     <span className="text-gray-200">System Activity</span>
                   </div>
                   <div className="flex gap-2 items-center">
                     <span className="relative flex h-2 w-2">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                     </span>
                     <span className="text-[10px] font-black tracking-widest uppercase text-gray-400">Live</span>
                   </div>
                 </h3>
                 <div className="space-y-4 overflow-y-auto pr-2 no-scrollbar flex-1 relative z-10">
                    {activities.map((a, i) => (
                      <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                         <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 shrink-0 border border-white/5 group-hover:bg-white/20 group-hover:text-white transition-all">
                           <Icon name={a.type === 'ngo' ? 'ngo' : a.type === 'payment' ? 'finance' : a.type === 'cake' ? 'cake' : 'tree'} size={14} />
                         </div>
                         <div className="flex-1 min-w-0">
                           <p className="text-sm font-medium text-gray-400 leading-snug group-hover:text-white transition-colors">{a.msg}</p>
                           <div className="text-[10px] text-gray-600 mt-1.5 font-black uppercase tracking-widest">{a.time} • System Admin</div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        );
      })()}

      {activeSection === "User Management" && (() => {
        const totalAmount = enrichedUsers.reduce((sum, u) => sum + u.amount, 0);
        const assignedUsers = enrichedUsers.filter(u => u.ngo !== 'Not Assigned').length;
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Top Level Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between hover:border-black transition-colors">
                <div>
                  <div className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-1">Total Network</div>
                  <div className="text-2xl font-black text-black">{enrichedUsers.length} <span className="text-xs text-gray-400 font-bold ml-1">Citizens</span></div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gray-100 text-black border border-gray-200 flex items-center justify-center">
                  <Icon name="users" size={20} />
                </div>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between hover:border-black transition-colors">
                <div>
                  <div className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-1">NGO Assigned</div>
                  <div className="text-2xl font-black text-black">{assignedUsers}</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gray-100 text-black border border-gray-200 flex items-center justify-center">
                  <Icon name="ngo" size={20} />
                </div>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between hover:border-black transition-colors">
                <div>
                  <div className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-1">Unassigned Queue</div>
                  <div className="text-2xl font-black text-black">{enrichedUsers.length - assignedUsers}</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gray-100 text-black border border-gray-200 flex items-center justify-center">
                  <Icon name="calendar" size={20} />
                </div>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between hover:border-black transition-colors">
                <div>
                  <div className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-1">Citizen Funding</div>
                  <div className="text-2xl font-black text-black">₹{totalAmount.toLocaleString()}</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gray-100 text-black border border-gray-200 flex items-center justify-center">
                  <Icon name="finance" size={20} />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm gap-4">
              <div className="pl-2">
                <h2 className="text-xl font-black text-gray-900">Citizen Directory</h2>
                <p className="text-xs text-gray-400 font-medium italic">Managing {enrichedUsers.length} active contributors</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Icon name="search" size={14} />
                  </div>
                  <input type="text" placeholder="Search Citizens..." className="bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold focus:bg-white focus:border-black outline-none transition-all w-full sm:w-64" />
                </div>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-black text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-900 transition-all shadow-sm w-full sm:w-auto shrink-0"
                >
                  <Icon name="plus" size={14} /> Add New Citizen
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100">
                      <th className="px-6 py-4 pl-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Citizen Details</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Digital Token</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contribution</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">NGO Assignment</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Status</th>
                      <th className="px-6 py-4 pr-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Progress Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {enrichedUsers.map(u => {
                      return (
                        <tr key={u.id} className="text-sm hover:bg-gray-50/80 transition-colors group">
                          <td className="px-6 py-4 pl-8">
                            <div className="font-black text-black border-l-2 border-transparent group-hover:border-black pl-2 -ml-2 transition-all">{u.name}</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{u.id} • {u.location || 'HQ'}</div>
                          </td>
                          <td className="px-6 py-4 font-mono text-gray-500 font-extrabold tracking-tighter text-xs">{u.token}</td>
                          <td className="px-6 py-4">
                            <div className="font-black text-black">₹{u.amount.toLocaleString()}</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase">{u.trees} {u.trees === 1 ? 'Tree' : 'Trees'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${u.ngo === 'Not Assigned' ? 'bg-gray-50 text-gray-500 border-gray-200' : 'bg-black text-white border-black'}`}>
                               {u.ngo === 'Not Assigned' ? <Icon name="activity" size={12} /> : <Icon name="check" size={12} />}
                               {u.ngo}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${u.welcomeEmailSent ? 'text-emerald-500' : 'text-gray-400'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${u.welcomeEmailSent ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                                {u.welcomeEmailSent ? 'Delivered' : 'Not Sent'}
                              </div>
                              {!u.welcomeEmailSent && (
                                <button 
                                  onClick={async () => {
                                    try {
                                      setLoading(true);
                                      await resendWelcomeEmail(u.id);
                                      toast.success("Welcome email sent successfully.");
                                      refreshData();
                                    } catch (e: any) {
                                      toast.error(e.message || "Failed to resend email.");
                                    } finally {
                                      setLoading(false);
                                    }
                                  }}
                                  className="p-1 hover:bg-gray-100 rounded text-black transition-colors"
                                  title="Retry Send Email"
                                >
                                  <Icon name="reports" size={12} />
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 pr-8 text-right flex items-center justify-end gap-3">
                              <Badge status={u.status} />
                              {u.status === 'Planted' && (
                               <button 
                                  onClick={async () => {
                                    const sub = submissions.find(s => 
                                      s.userId?.trim().toLowerCase() === u.id.toLowerCase() || 
                                      s.orderId?.trim().toLowerCase() === u.token.toLowerCase() ||
                                      s.userId?.trim().toLowerCase() === u.name.toLowerCase()
                                    );
                                    
                                    if (sub) {
                                      try {
                                        setLoading(true);
                                        const payload = {
                                          userId: u.id,
                                          userName: u.name,
                                          ngoId: u.ngo || 'Unknown',
                                          ngoName: u.ngo || 'NGO Partner',
                                          submissionId: sub._id || sub.id,
                                          lat: sub.lat || 0,
                                          lng: sub.lng || 0,
                                          imageUrl: sub.proofs?.[0] || sub.fileNames?.[0] || '',
                                          verificationCode: `CERT-${u.id}-${Date.now()}`
                                        };
                                        console.log("[DEBUG] Syncing to MongoDB with payload:", payload);
                                        const cert = await createCertificate(payload);
                                        setSelectedCertificateUser({ ...u, submission: sub, certificate: cert });
                                        setShowCertificateModal(true);
                                      } catch (e) {
                                        console.error("Cert save failed:", e);
                                        toast.error("Backend error: Could not sync certificate record to MongoDB.");
                                      } finally {
                                        setLoading(false);
                                      }
                                    } else {
                                      toast.error("Error: No plantation submission found for this user. The certificate cannot be verified without proof-of-plantation data.");
                                    }
                                  }}
                                  className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors group/cert"
                                  title="View Certificate"
                                >
                                  <Icon name="reports" size={16} />
                                </button>
                              )}
                           </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {enrichedUsers.length === 0 && (
                <div className="py-16 text-center">
                  <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon name="users" size={32} />
                  </div>
                  <h3 className="text-gray-900 font-black mb-1">No Citizens Found</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Register the first citizen to track contributions</p>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {activeSection === "NGO Management" && (() => {
        const totalNgos = enrichedNgos.length;
        const totalCapacity = enrichedNgos.reduce((sum, n) => sum + (n.assigned || 0), 0);
        const totalPlanted = submissions.reduce((sum, s) => sum + (s.count || 0), 0);
        const avgRating = totalNgos > 0 ? (enrichedNgos.reduce((sum, n) => sum + (n.rating || 0), 0) / totalNgos).toFixed(1) : "0.0";
        
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Top Level Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between hover:border-black transition-colors">
                <div>
                  <div className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-1">Active Partners</div>
                  <div className="text-2xl font-black text-black">{totalNgos} <span className="text-xs text-gray-400 font-bold ml-1">NGOs</span></div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gray-100 text-black border border-gray-200 flex items-center justify-center">
                  <Icon name="ngo" size={20} />
                </div>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between hover:border-black transition-colors">
                <div>
                  <div className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-1">Total Planted</div>
                  <div className="text-2xl font-black text-black">{totalPlanted.toLocaleString()}</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gray-100 text-black border border-gray-200 flex items-center justify-center">
                  <Icon name="tree" size={20} />
                </div>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between hover:border-black transition-colors">
                <div>
                  <div className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-1">Goal Capacity</div>
                  <div className="text-2xl font-black text-black">{totalCapacity.toLocaleString()}</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gray-100 text-black border border-gray-200 flex items-center justify-center">
                  <Icon name="activity" size={20} />
                </div>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between hover:border-black transition-colors">
                <div>
                  <div className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-1">Average Rating</div>
                  <div className="text-2xl font-black text-black">★ {avgRating}</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gray-100 text-black border border-gray-200 flex items-center justify-center">
                  <Icon name="star" size={20} />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
              <div className="pl-2">
                <h2 className="text-xl font-black text-gray-900">NGO Management</h2>
                <p className="text-xs text-gray-400 font-medium italic">Partnering with {enrichedNgos.length} environmental organizations</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowAddNgoModal(true)}
                  className="bg-black text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-gray-900 transition-all shadow-sm"
                >
                  <Icon name="plus" size={14} /> Register New NGO
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                    <Icon name="map" size={18} className="text-black" />
                    Registered NGO Partners
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {enrichedNgos.map(n => {
                      const completedPercent = n.assigned > 0 ? (n.completed / n.assigned) * 100 : 0;
                      return (
                        <div key={n.id} className="bg-gray-50 border border-gray-200 p-5 rounded-2xl space-y-4 hover:border-black transition-colors group">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-sm font-black text-black group-hover:text-gray-700 transition-colors">{n.name}</div>
                              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{n.area}</div>
                            </div>
                            <div className="bg-gray-200 text-black text-[10px] font-black px-2 py-1.5 rounded-lg flex items-center gap-1 border border-gray-300">
                              <Icon name="star" size={12} /> {n.rating}
                            </div>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                              <span>Progress</span>
                              <span className="text-black">{Math.round(completedPercent)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-black" style={{ width: `${Math.min(completedPercent, 100)}%` }} />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center pt-2">
                            <div className="bg-white p-2.5 rounded-xl border border-gray-200 shadow-sm">
                              <div className="text-sm font-black text-black">{n.completed}</div>
                              <div className="text-[8px] text-gray-500 font-black uppercase tracking-widest mt-0.5">Planted</div>
                            </div>
                            <div className="bg-white p-2.5 rounded-xl border border-gray-200 shadow-sm">
                              <div className="text-sm font-black text-gray-600">{n.pending}</div>
                              <div className="text-[8px] text-gray-500 font-black uppercase tracking-widest mt-0.5">Pending</div>
                            </div>
                            <div className="bg-white p-2.5 rounded-xl border border-gray-200 shadow-sm">
                              <div className="text-sm font-black text-gray-400">{n.assigned}</div>
                              <div className="text-[8px] text-gray-500 font-black uppercase tracking-widest mt-0.5">Goal</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full max-h-[700px] flex flex-col">
                  <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                    <div>
                      <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                        <Icon name="users" size={18} className="text-gray-400" />
                        Assign Orders
                      </h3>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Pending Citizen Trees</p>
                    </div>
                    <div className="bg-gray-100 text-black text-[10px] font-black px-2.5 py-1 rounded-lg border border-gray-200">
                      {enrichedUsers.filter(u => u.ngo === 'Not Assigned').length} Queue
                    </div>
                  </div>
                  
                  <div className="space-y-3 overflow-y-auto pr-2 no-scrollbar flex-1">
                    {enrichedUsers.filter(u => u.ngo === 'Not Assigned').length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-200">
                          <Icon name="check" size={24} />
                        </div>
                        <h4 className="text-gray-900 font-black">All Caught Up!</h4>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">No pending citizen orders</p>
                      </div>
                    ) : (
                      enrichedUsers.filter(u => u.ngo === 'Not Assigned').map(u => (
                        <div key={u.id} className="bg-gray-50 border border-gray-200 p-4 rounded-2xl flex items-center justify-between group hover:border-black transition-colors">
                          <div>
                            <div className="text-sm font-black text-gray-900 group-hover:text-black transition-colors">{u.name}</div>
                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{u.location} • {u.trees} {u.trees === 1 ? 'Tree' : 'Trees'}</div>
                          </div>
                          <button 
                            onClick={() => { setSelectedUser(u); setShowAssignModal(true); }}
                            className="bg-white text-black p-2.5 rounded-xl border border-gray-300 hover:bg-black hover:text-white hover:border-black transition-all shadow-sm"
                          >
                            <Icon name="plus" size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {activeSection === "Cake Management" && (() => {
        const deliveredCakes = enrichedUsers.filter(u => u.cakeStatus === 'Delivered').length;
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard label="Total Cake Commitments" value={enrichedUsers.length} icon="cake" colorClass="bg-gray-100 text-black" />
              <StatCard label="Successfully Delivered" value={deliveredCakes} icon="check" colorClass="bg-gray-100 text-black" />
              <StatCard label="Pending Orders" value={enrichedUsers.length - deliveredCakes} icon="calendar" colorClass="bg-gray-100 text-black text-rose-600" />
            </div>

            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div>
                <h3 className="text-xl font-black text-black uppercase tracking-tight">Cake Delivery Registry</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1 italic">Tracking celebratory deliveries by region</p>
              </div>
              <button onClick={() => setShowAddVendorModal(true)} className="bg-black text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-gray-900 transition-all shadow-xl">
                 <Icon name="plus" size={14} /> Add Delivery Vendor
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="bg-gray-50 border-b border-gray-100">
                       <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Citizen Account</th>
                       <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Location</th>
                       <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned Delivery Vendor</th>
                       <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status Tracking</th>
                       <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                     {enrichedUsers.map(u => {
                       const v = getDisplayedCakeVendor(u, cakeVendors);
                       return (
                         <tr key={u.id} className="text-sm hover:bg-gray-50/50 transition-colors group">
                           <td className="px-6 py-4">
                             <div className="font-black text-black group-hover:text-gray-700 transition-colors uppercase tracking-tight">{u.name}</div>
                             <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{u.phone}</div>
                           </td>
                           <td className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-widest italic">{u.location || 'Satellite Area'}</td>
                           <td className="px-6 py-4">
                             <div className="font-black text-black uppercase text-xs">{v.name}</div>
                             <div className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">₹{v.costPerCake} Unit Cost</div>
                           </td>
                           <td className="px-6 py-4">
                              <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${u.cakeStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                {u.cakeStatus || 'Pending'}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-right">
                             {u.cakeStatus !== 'Delivered' && (
                               <button 
                                 onClick={() => handleMarkDelivered(u.id)}
                                 className="text-black hover:text-emerald-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-1 ml-auto group/btn transition-all"
                               >
                                 Mark Delivered <Icon name="check" size={12} className="group-hover/btn:scale-125 transition-transform" />
                               </button>
                             )}
                           </td>
                         </tr>
                       );
                     })}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        );
      })()}

      {activeSection === "Tree Map" && (() => {
        const filteredSubmissions = submissions.filter(s => s.lat && s.lng && (ngoFilter === 'All NGOs' || s.ngoId === ngoFilter || s.ngoId === ngos.find(n => n.id === ngoFilter)?.name));
        const filteredTreeEntries = treeEntries.filter(te => te.lat && te.lng && (ngoFilter === 'All NGOs' || te.ngoId === ngoFilter || te.ngoId === ngos.find(n => n.id === ngoFilter)?.name));

        return (
        <div className="h-[calc(100vh-180px)] flex flex-col gap-4 animate-in fade-in duration-700">
          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex justify-between items-center group hover:border-black transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-transform">
                <Icon name="map" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-black uppercase tracking-tighter">Planetary Reforestation Grid</h3>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Real-time visualization of global plantation impact</p>
              </div>
            </div>
            <div className="flex gap-4 items-center">
               <select 
                 value={ngoFilter} 
                 onChange={e => setNgoFilter(e.target.value)}
                 className="bg-gray-50 border border-gray-200 text-[10px] font-black px-3 py-2 rounded-xl outline-none uppercase tracking-widest cursor-pointer"
               >
                 <option value="All NGOs">All NGOs</option>
                 {ngos.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
               </select>
               <div className="flex -space-x-3 overflow-hidden p-2">
                 {enrichedNgos.map((n, i) => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black text-white shadow-md hover:z-10 transition-all hover:scale-110" style={{ backgroundColor: ngoColorMap[n.id] }} title={n.name}>
                     {n.name.substring(0,1)}
                   </div>
                 ))}
               </div>
               <div className="bg-gray-100 text-[10px] font-black px-4 py-2.5 rounded-xl border border-gray-200 uppercase tracking-widest shadow-inner">
                 Total Markers: {filteredTreeEntries.length + filteredSubmissions.length}
               </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-3 border border-gray-100 shadow-2xl flex-1 relative overflow-hidden group">
            <div className="absolute inset-0 z-0 bg-gray-50 animate-pulse flex items-center justify-center text-gray-200">
              <Icon name="map" size={100} />
            </div>
            <div className="relative h-full w-full z-10 rounded-2xl overflow-hidden border border-gray-100 shadow-inner">
              <MapContainer 
                center={[23.2599, 77.4126]} // Bhopal, India
                zoom={6} 
                style={{ height: '100%', width: '100%' }}
                ref={setMapRef}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredSubmissions
                  .map((s, idx) => {
                    const user = users.find(u => {
                      const uid = u.id ? String(u.id).trim().toLowerCase() : '';
                      const utoken = u.token ? String(u.token).trim().toLowerCase() : '';
                      const uname = u.name ? String(u.name).trim().toLowerCase() : '';
                      
                      const sUserId = s.userId ? String(s.userId).trim().toLowerCase() : '';
                      const sOrderId = s.orderId ? String(s.orderId).trim().toLowerCase() : '';
                      
                      return (sUserId && (uid === sUserId || uname === sUserId)) || 
                             (sOrderId && (utoken === sOrderId || uid === sOrderId));
                    });
                    const ngo = ngos.find(n => n.id === s.ngoId || n.name === s.ngoId);
                    const markerColor = ngoColorMap[s.ngoId] || '#10b981';
                    
                    const offsetStr = s.userId || s.orderId || s._id || idx.toString();
                    const offset = getOffset(offsetStr);
                    const position: [number, number] = [s.lat + offset.lat, s.lng + offset.lng];
                    
                    return (
                      <Marker 
                        key={`sub-${idx}`} 
                        position={position} 
                        icon={L.divIcon({
                          className: 'custom-div-icon',
                          html: `<div style="background-color: ${markerColor}; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 15px ${markerColor}66;"></div>`,
                          iconSize: [14, 14],
                          iconAnchor: [7, 7]
                        })}
                      >
                        <Popup className="font-sans">
                          <div className="p-1 min-w-[180px]">
                            <div className="text-center font-black text-gray-900 border-b border-gray-100 pb-2 mb-2 flex flex-col gap-0.5">
                              <span className="text-xs uppercase tracking-tighter text-gray-400">Contributor</span>
                              <span className="text-sm">{user?.name || s.orderId || s.userId || 'Authorized Citizen'}</span>
                            </div>
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">User Name</span>
                                <span className="text-[10px] text-black font-black uppercase text-right">
                                  {user?.name || s.orderId || s.userId || 'Authorized Citizen'}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Plantation Info</span>
                                <span className="text-xs text-black font-black">{s.count || 1} {s.species || 'Native'} Tree(s)</span>
                              </div>
                              <div className="pt-2 mt-1 border-t border-gray-50">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: markerColor }}></div>
                                  <span className="text-[10px] text-gray-900 font-black uppercase tracking-tight">{ngo?.name || s.ngoId}</span>
                                </div>
                              </div>
                            </div>
                            {s.fileNames && s.fileNames.length > 0 && (
                              <div className="mt-3 text-[9px] bg-emerald-50 text-emerald-600 py-1.5 px-2 rounded-xl border border-emerald-100 flex items-center justify-center gap-1.5 font-black uppercase tracking-tight">
                                <Icon name="check" size={10} /> Photo Evidence Verified
                              </div>
                            )}
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                  
                {filteredTreeEntries
                  .map((te, idx) => {
                    const user = users.find(u => {
                      const uid = u.id ? String(u.id).trim().toLowerCase() : '';
                      const utoken = u.token ? String(u.token).trim().toLowerCase() : '';
                      const uname = u.name ? String(u.name).trim().toLowerCase() : '';
                      
                      const teUserId = te.userId ? String(te.userId).trim().toLowerCase() : '';
                      const teOrderId = te.orderId ? String(te.orderId).trim().toLowerCase() : '';
                      
                      return (teUserId && (uid === teUserId || uname === teUserId)) || 
                             (teOrderId && (utoken === teOrderId || uid === teOrderId));
                    });
                    const ngo = ngos.find(n => n.id === te.ngoId || n.name === te.ngoId);
                    const markerColor = ngoColorMap[te.ngoId] || '#10b981';

                    const offsetStr = te.userId || te.orderId || te._id || idx.toString();
                    const offset = getOffset(offsetStr);
                    const position: [number, number] = [te.lat + offset.lat, te.lng + offset.lng];
                    
                    return (
                      <Marker 
                        key={`te-${idx}`} 
                        position={position} 
                        icon={L.divIcon({
                          className: 'custom-div-icon',
                          html: `<div style="background-color: ${markerColor}; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 15px ${markerColor}66;"></div>`,
                          iconSize: [14, 14],
                          iconAnchor: [7, 7]
                        })}
                      >
                        <Popup className="font-sans">
                          <div className="p-1 min-w-[180px]">
                            <div className="text-center font-black text-gray-900 border-b border-gray-100 pb-2 mb-2 flex flex-col gap-0.5">
                              <span className="text-xs uppercase tracking-tighter text-gray-400">Contributor</span>
                              <span className="text-sm">{user?.name || te.orderId || te.userId || 'Authorized Citizen'}</span>
                            </div>
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">User Name</span>
                                <span className="text-[10px] text-black font-black uppercase text-right">
                                  {user?.name || te.orderId || te.userId || 'Authorized Citizen'}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Plantation Info</span>
                                <span className="text-xs text-black font-black">1 Native</span>
                              </div>
                              <div className="pt-2 mt-1 border-t border-gray-50">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: markerColor }}></div>
                                  <span className="text-[10px] text-gray-900 font-black uppercase tracking-tight">{ngo?.name || te.ngoId}</span>
                                </div>
                              </div>
                            </div>
                            {te.fileNames && te.fileNames.length > 0 && (
                              <div className="mt-3 text-[9px] bg-emerald-50 text-emerald-600 py-1.5 px-2 rounded-xl border border-emerald-100 flex items-center justify-center gap-1.5 font-black uppercase tracking-tight">
                                <Icon name="check" size={10} /> Photo Evidence Verified
                              </div>
                            )}
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
              </MapContainer>
            </div>
          </div>
        </div>
        );
      })()}

      {showCertificateModal && selectedCertificateUser && (
        <CertificateModal 
          user={selectedCertificateUser}
          submission={selectedCertificateUser.submission}
          onClose={() => setShowCertificateModal(false)}
        />
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20 flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
              <div>
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Register New Citizen</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Onboarding to the ForestGift Network</p>
              </div>
              <button 
                onClick={() => { setShowAddModal(false); setBulkDataPreview(null); setBulkImportStatus(null); }}
                className="p-3 hover:bg-white rounded-2xl text-gray-400 hover:text-rose-500 transition-all border border-transparent hover:border-gray-100 shadow-sm"
              >
                <Icon name="x" size={24} />
              </button>
            </div>
            
            <div className="overflow-y-auto no-scrollbar">
              {bulkImportStatus ? (
                <div className="p-16 text-center animate-in fade-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[32px] flex items-center justify-center mx-auto mb-6 border border-emerald-100 shadow-inner">
                    <Icon name="check" size={48} />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Import Successful</h2>
                  <p className="text-sm font-bold text-gray-500 mb-8 uppercase tracking-widest leading-relaxed">Successfully imported<br/><span className="text-emerald-600 font-black">{bulkImportStatus.success}</span> out of <span className="text-black font-black">{bulkImportStatus.total}</span> citizens into the network.</p>
                  <button onClick={() => { setShowAddModal(false); setBulkDataPreview(null); setBulkImportStatus(null); }} className="bg-black text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gray-900 transition-colors shadow-xl">
                    Close Registration
                  </button>
                </div>
              ) : bulkDataPreview ? (
                <div className="p-8 flex flex-col gap-6 animate-in fade-in duration-300">
                  <div>
                    <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">Review Data Before Processing</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Please verify the <span className="text-black">{bulkDataPreview.length} records</span> extracted from the uploaded sheet.</p>
                  </div>
                  <div className="border border-gray-100 rounded-3xl overflow-hidden max-h-72 overflow-y-auto shadow-inner bg-gray-50">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-white text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 sticky top-0 shadow-sm">
                          <th className="px-5 py-4">Citizen Name</th>
                          <th className="px-5 py-4">Contact Email</th>
                          <th className="px-5 py-4">Target Zone</th>
                          <th className="px-5 py-4 text-right">Trees</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm font-bold text-gray-700 bg-white">
                        {bulkDataPreview.map((row, i) => (
                          <tr key={i} className="hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-3 text-black font-black">{row.name}</td>
                            <td className="px-5 py-3 text-xs">{row.email}</td>
                            <td className="px-5 py-3 text-[11px] font-black uppercase tracking-widest text-gray-500">{row.location}</td>
                            <td className="px-5 py-3 text-emerald-600 font-black text-right">{row.trees}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex gap-4 pt-2">
                    <button onClick={() => setBulkDataPreview(null)} disabled={loading} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors">
                      Cancel Import
                    </button>
                    <button onClick={confirmBulkImport} disabled={loading} className="flex-[2] bg-emerald-600 text-white py-4 rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-700 transition-colors shadow-xl disabled:opacity-50">
                      {loading ? 'Processing Batch...' : `Confirm & Import ${bulkDataPreview.length} Citizens`}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-8 pb-0 flex flex-col gap-4 border-b border-gray-50">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-black text-emerald-900 uppercase tracking-widest">Bulk Import Citizens</h4>
                        <p className="text-[10px] text-emerald-600 font-bold leading-tight mt-1">Upload an Excel (.xlsx) or CSV file with headers: Name, Email, Phone, Address, DOB, Amount, Location.</p>
                      </div>
                      <div>
                        <input type="file" id="bulk-upload" accept=".xlsx, .xls, .csv" className="hidden" onChange={handleBulkUpload} disabled={loading} />
                        <label htmlFor="bulk-upload" className="cursor-pointer bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors shadow-sm inline-block whitespace-nowrap">
                           {loading ? 'Reading...' : 'Upload File'}
                        </label>
                      </div>
                    </div>
                    <div className="relative text-center my-2">
                      <span className="absolute inset-x-0 top-1/2 -mt-px bg-gray-100 h-px"></span>
                      <span className="relative bg-white px-2 py-1 text-[10px] uppercase font-black tracking-widest text-gray-400">OR REGISTER SINGLE</span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black pl-1 text-gray-400 uppercase tracking-widest">Full Name</label>
                        <input required className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-black focus:bg-white focus:border-black outline-none transition-all shadow-inner" placeholder="e.g. Rahul Sharma" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black pl-1 text-gray-400 uppercase tracking-widest">Email Address</label>
                        <input required type="email" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-black focus:bg-white focus:border-black outline-none transition-all shadow-inner" placeholder="rahul@domain.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                        <label className="text-[10px] font-black pl-1 text-gray-400 uppercase tracking-widest">Mobile Number</label>
                        <input required className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-black focus:bg-white focus:border-black outline-none transition-all shadow-inner" placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black pl-1 text-gray-400 uppercase tracking-widest">Date of Birth</label>
                        <input required type="date" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-black focus:bg-white focus:border-black outline-none transition-all shadow-inner" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black pl-1 text-gray-400 uppercase tracking-widest">Permanent Address</label>
                      <input required className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-black focus:bg-white focus:border-black outline-none transition-all shadow-inner" placeholder="Full residential address..." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black pl-1 text-gray-400 uppercase tracking-widest">Contribution (₹)</label>
                        <input required type="number" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-black focus:bg-white focus:border-black outline-none transition-all shadow-inner" value={formData.amount} onChange={e => setFormData({...formData, amount: parseInt(e.target.value), trees: Math.floor(parseInt(e.target.value)/1000) || 1})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black pl-1 text-gray-400 uppercase tracking-widest">Tree Count</label>
                        <input readOnly className="w-full bg-gray-100 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-black text-emerald-600 cursor-not-allowed" value={formData.trees} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black pl-1 text-gray-400 uppercase tracking-widest">Plantation Zone</label>
                        <select className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-black focus:bg-white focus:border-black outline-none transition-all shadow-inner" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}>
                          <option>Satellite Block A</option>
                          <option>Satellite Block B</option>
                          <option>Narmada Zone</option>
                          <option>Satpura Zone</option>
                          <option>Malwa Zone</option>
                          <option>Central Zone</option>
                        </select>
                      </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-black text-white py-5 rounded-[20px] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-gray-900 transition-all shadow-2xl disabled:opacity-50 mt-4 border border-white/10">
                      {loading ? 'Processing Transaction...' : 'Establish Citizen Record'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADDITIONAL MANAGEMENT MODALS */}
      {showAddNgoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">NGO Partner Registration</h3>
              <button 
                onClick={() => setShowAddNgoModal(false)}
                className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-rose-500 transition-colors"
              >
                <Icon name="x" size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitNgo} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black p-1 text-gray-400 uppercase tracking-widest">Organization Name</label>
                  <input required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold focus:bg-white focus:border-black outline-none transition-all" value={ngoFormData.name} onChange={e => setNgoFormData({...ngoFormData, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black p-1 text-gray-400 uppercase tracking-widest">Registration ID</label>
                  <input required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold focus:bg-white focus:border-black outline-none transition-all" value={ngoFormData.reg} onChange={e => setNgoFormData({...ngoFormData, reg: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black p-1 text-gray-400 uppercase tracking-widest">Operating Area</label>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold focus:bg-white focus:border-black outline-none transition-all" value={ngoFormData.area} onChange={e => setNgoFormData({...ngoFormData, area: e.target.value})}>
                  <option>Satellite Block A</option>
                  <option>Satellite Block B</option>
                  <option>Narmada Zone</option>
                  <option>Satpura Zone</option>
                  <option>Malwa Zone</option>
                  <option>Central Zone</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black p-1 text-gray-400 uppercase tracking-widest">Primary Email</label>
                  <input required type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold focus:bg-white focus:border-black outline-none transition-all" value={ngoFormData.email} onChange={e => setNgoFormData({...ngoFormData, email: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black p-1 text-gray-400 uppercase tracking-widest">Support Line</label>
                  <input required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold focus:bg-white focus:border-black outline-none transition-all" value={ngoFormData.phone} onChange={e => setNgoFormData({...ngoFormData, phone: e.target.value})} />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-black text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gray-900 transition-all shadow-xl disabled:opacity-50 mt-4">
                {loading ? 'Processing...' : 'Register Organization'}
              </button>
            </form>
          </div>
        </div>
      )}

      {showAddVendorModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Cake Vendor Registration</h3>
              <button onClick={() => setShowAddVendorModal(false)} className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-rose-500 transition-colors">
                <Icon name="x" size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitVendor} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black p-1 text-gray-400 uppercase tracking-widest">Vendor Name</label>
                  <input required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold focus:bg-white focus:border-black outline-none transition-all" value={vendorFormData.name} onChange={e => setVendorFormData({...vendorFormData, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black p-1 text-gray-400 uppercase tracking-widest">Service Area</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold focus:bg-white focus:border-black outline-none transition-all" value={vendorFormData.area} onChange={e => setVendorFormData({...vendorFormData, area: e.target.value})}>
                    <option>Satellite Block A</option>
                    <option>Satellite Block B</option>
                    <option>Narmada Zone</option>
                    <option>Satpura Zone</option>
                    <option>Malwa Zone</option>
                    <option>Central Zone</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black p-1 text-gray-400 uppercase tracking-widest">Contact Phone</label>
                  <input required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold focus:bg-white focus:border-black outline-none transition-all" value={vendorFormData.phone} onChange={e => setVendorFormData({...vendorFormData, phone: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black p-1 text-gray-400 uppercase tracking-widest">Unit Price (₹)</label>
                  <input required type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold focus:bg-white focus:border-black outline-none transition-all" value={vendorFormData.costPerCake} onChange={e => setVendorFormData({...vendorFormData, costPerCake: parseInt(e.target.value)})} />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-black text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gray-900 transition-all shadow-xl disabled:opacity-50 mt-4">
                {loading ? 'Processing...' : 'Register Vendor'}
              </button>
            </form>
          </div>
        </div>
      )}

      {showAssignModal && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Assign Order</h3>
              <button onClick={() => setShowAssignModal(false)} className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-rose-500 transition-colors">
                <Icon name="x" size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAssign} className="p-6 space-y-6">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Citizen Details</p>
                <p className="text-sm font-black text-black">{selectedUser.name}</p>
                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-1">Location: {selectedUser.location}</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black p-1 text-gray-400 uppercase tracking-widest">Select NGO Partner</label>
                <select 
                  required 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-black focus:bg-white focus:border-black outline-none transition-all"
                  value={selectedNgoId}
                  onChange={e => setSelectedNgoId(e.target.value)}
                >
                  <option value="">Select an NGO...</option>
                  {(() => {
                    // Show NGOs in the same area first; if none match, show all NGOs
                    const locationMatches = ngos.filter(n => n.area === selectedUser.location);
                    const ngoList = locationMatches.length > 0 ? locationMatches : ngos;
                    return ngoList.map(n => (
                      <option key={n.id} value={n.id}>
                        {n.name} — {n.area} (Capacity: {n.assigned})
                      </option>
                    ));
                  })()}
                </select>
                {ngos.filter(n => n.area === selectedUser.location).length === 0 && ngos.length > 0 && (
                  <p className="text-[10px] text-amber-500 font-bold pl-1">
                    No NGOs found in {selectedUser.location} — showing all available NGOs.
                  </p>
                )}
              </div>

              <button type="submit" disabled={loading || !selectedNgoId} className="w-full bg-black text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gray-900 transition-all shadow-xl disabled:opacity-50">
                {loading ? 'Processing...' : 'Confirm Assignment'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* REMAINDER MODALS (Reports, Settings) MOCKED FOR BREVITY BUT ENSURING SYNTAX COMPLETION */}
      {activeSection === "Reports & Analytics" && (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
           {/* Header */}
           <div>
             <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Ecosystem Impact Analytics</h2>
             <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mt-2">Real-time telemetry and growth metrics</p>
           </div>
           
           {/* High level stats map */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {(() => {
                const totalRequestedTrees = users.reduce((acc, u) => acc + (u.trees || 1), 0);
                const totalPlantedTrees = submissions.reduce((acc, s) => acc + (Number(s.count) || s.fileNames?.length || 1), 0);
                const carbonSavedKg = totalPlantedTrees * 21; 
                const thisMonthUsers = users.filter(u => !u.createdAt || (new Date(u.createdAt).getMonth() === new Date().getMonth())).length;
                
                return (
                  <>
                    <div className="bg-emerald-600 text-white p-6 rounded-3xl shadow-xl shadow-emerald-500/20 relative overflow-hidden flex flex-col justify-between">
                       <div className="relative z-10">
                         <div className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-2">Total Carbon Saved</div>
                         <div className="text-4xl font-black tracking-tighter">{carbonSavedKg.toLocaleString()} <span className="text-lg">kg</span></div>
                       </div>
                       <Icon name="check" size={120} className="absolute -right-6 -bottom-6 text-emerald-500 opacity-50" />
                    </div>
                    <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
                       <div>
                         <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Trees Planted</div>
                         <div className="text-4xl font-black text-gray-900 tracking-tighter">{totalPlantedTrees}</div>
                       </div>
                    </div>
                    <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
                       <div>
                         <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Partnering NGOs</div>
                         <div className="text-4xl font-black text-gray-900 tracking-tighter">{ngos.length}</div>
                       </div>
                    </div>
                    <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
                       <div>
                         <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">New Citizens (Month)</div>
                         <div className="text-4xl font-black text-emerald-600 tracking-tighter">+{thisMonthUsers}</div>
                       </div>
                    </div>
                  </>
                );
              })()}
           </div>

           {/* Charts */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="col-span-1 lg:col-span-2 bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
               <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Forest & Revenue Growth Trajectory</h3>
               <div className="h-72 w-full">
                  {(() => {
                    const timelineData = [];
                    let sortedUsers = [...users].sort((a,b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
                    if(sortedUsers.length === 0) timelineData.push({name: 'Launch', trees: 0, revenue: 0});
                    else {
                      let cumulativeTrees = 0;
                      let cumulativeRevenue = 0;
                      const segmentSize = Math.max(1, Math.ceil(sortedUsers.length / 5));
                      for(let i=0; i<sortedUsers.length; i+=segmentSize) {
                        const chunk = sortedUsers.slice(i, i+segmentSize);
                        chunk.forEach(u => {
                           cumulativeTrees += (u.trees || 1);
                           cumulativeRevenue += (u.amount || 1000);
                        });
                        timelineData.push({
                           name: `Cohort ${i/segmentSize + 1}`,
                           trees: cumulativeTrees,
                           revenue: cumulativeRevenue
                        });
                      }
                    }
                    return (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={timelineData} margin={{top: 5, right: 5, bottom: 5, left: 5}}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af', fontWeight: 900}} dy={10} />
                          <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af', fontWeight: 900}} />
                          <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af', fontWeight: 900}} tickFormatter={(v) => `₹${v}`} />
                          <RechartsTooltip cursor={{stroke: '#e5e7eb', strokeWidth: 2}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                          <Line yAxisId="left" type="monotone" dataKey="trees" stroke="#059669" strokeWidth={4} dot={{r: 6, strokeWidth: 2, fill: '#fff'}} activeDot={{r: 8}} name="Total Trees" />
                          <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} dot={{r: 6, strokeWidth: 2, fill: '#fff'}} activeDot={{r: 8}} name="Revenue" />
                        </LineChart>
                      </ResponsiveContainer>
                    );
                  })()}
               </div>
             </div>
             
             <div className="col-span-1 bg-white border border-gray-100 p-8 rounded-3xl shadow-sm flex flex-col justify-between">
               <div>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Operational Summary</h3>
                  <div className="space-y-6">
                    {(() => {
                      const totalCakes = users.length;
                      const deliveredCakes = users.filter(u => u.status === 'Delivered' || u.status === 'Planted').length;
                      const pendingOrders = users.reduce((acc, u) => acc + (u.trees || 1), 0) - submissions.reduce((acc, s) => acc + (Number(s.count) || s.fileNames?.length || 1), 0);
                      
                      return (
                        <>
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Cakes Ordered</span>
                              <span className="text-xs font-black text-gray-900">{totalCakes}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full" style={{width: `${Math.min(100, Math.max(5, (totalCakes / (totalCakes+10)) * 100))}%`}}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Cakes Delivered</span>
                              <span className="text-xs font-black text-gray-900">{deliveredCakes}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full" style={{width: `${Math.min(100, totalCakes === 0 ? 0 : (deliveredCakes / totalCakes) * 100)}%`}}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Pending Blockers</span>
                              <span className="text-xs font-black text-amber-500 font-mono">{Math.max(0, pendingOrders)} Trees</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-400 rounded-full" style={{width: `${Math.min(100, pendingOrders > 0 ? 100 : 0)}%`}}></div>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
               </div>
               <div className="mt-8 bg-emerald-50 p-4 rounded-2xl flex items-center justify-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[9px] font-black uppercase tracking-widest text-emerald-700">Live Backend Stream</span>
               </div>
             </div>
           </div>

           {/* Certificate Registry Section */}
           <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
             <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
               <div>
                 <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Registry of Issued Certificates</h3>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Immutable Digital Environmental Credentials</p>
               </div>
               <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                  Total Issued: {certificates.length}
               </div>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead>
                   <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                     <th className="px-8 py-4">Recipient Name</th>
                     <th className="px-8 py-4">Verification Code</th>
                     <th className="px-8 py-4">Verifying NGO</th>
                     <th className="px-8 py-4">Issue Date</th>
                     <th className="px-8 py-4 text-center">Deliverability</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50 text-xs">
                   {certificates.map(c => (
                     <tr key={c._id} className="hover:bg-gray-50/80 transition-colors group">
                       <td className="px-8 py-4">
                         <div className="font-black text-black group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{c.userName}</div>
                         <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">ID: {c.userId}</div>
                       </td>
                       <td className="px-8 py-4 font-mono font-bold text-gray-600 tracking-tighter">{c.verificationCode}</td>
                       <td className="px-8 py-4">
                         <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                           <span className="font-black text-gray-900 text-[10px] uppercase">{c.ngoName}</span>
                         </div>
                       </td>
                       <td className="px-8 py-4 text-gray-500 font-bold">
                         {new Date(c.issueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                       </td>
                       <td className="px-8 py-4">
                          <div className={`flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest ${c.emailSent ? 'text-emerald-500' : 'text-gray-400'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${c.emailSent ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                            {c.emailSent ? 'Link Delivred' : 'Pending'}
                          </div>
                       </td>
                     </tr>
                   ))}
                   {certificates.length === 0 && (
                     <tr>
                       <td colSpan={5} className="py-12 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                         No certificates issued in current epoch
                       </td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
           </div>
        </div>
      )}
      
      {activeSection === "Role Management" && (
        <div className="animate-in fade-in duration-500 bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="p-4 sm:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50/50 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tight">Role Management</h2>
              <p className="text-[10px] sm:text-xs text-gray-500 font-bold tracking-widest uppercase mt-2">Manage Citizens, NGOs & Cake Vendors</p>
            </div>
            <div className="flex bg-gray-200/50 p-1 rounded-2xl w-full sm:w-auto overflow-x-auto no-scrollbar snap-x">
               <button onClick={() => setRoleManageTab('users')} className={`flex-1 sm:flex-none whitespace-nowrap snap-center px-4 sm:px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${roleManageTab === 'users' ? 'bg-white text-black shadow-md' : 'text-gray-500 hover:text-black'}`}>Citizens</button>
               <button onClick={() => setRoleManageTab('ngos')} className={`flex-1 sm:flex-none whitespace-nowrap snap-center px-4 sm:px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${roleManageTab === 'ngos' ? 'bg-white text-black shadow-md' : 'text-gray-500 hover:text-black'}`}>NGOs</button>
               <button onClick={() => setRoleManageTab('vendors')} className={`flex-1 sm:flex-none whitespace-nowrap snap-center px-4 sm:px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${roleManageTab === 'vendors' ? 'bg-white text-black shadow-md' : 'text-gray-500 hover:text-black'}`}>Vendors</button>
            </div>
          </div>
          
          <div className="p-4 sm:p-8 overflow-x-auto min-w-0">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID</th>
                  <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</th>
                  <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</th>
                  <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Zone / Area</th>
                  <th className="pb-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roleManageTab === 'users' && users.map(u => (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 font-mono text-xs font-bold text-gray-500">{u.id}</td>
                    <td className="py-4 text-sm font-black text-gray-900">{u.name}</td>
                    <td className="py-4 text-xs font-bold text-gray-500 w-1/4 truncate">{u.email}</td>
                    <td className="py-4 text-xs font-bold text-gray-500">{u.location}</td>
                    <td className="py-4 text-right space-x-2">
                       <button onClick={() => setEditingRoleItem({type: 'user', data: u})} className="px-3 py-1.5 bg-gray-100 hover:bg-black hover:text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-colors text-black">Edit</button>
                       <button onClick={() => handleDeleteRoleItem('user', u.id)} className="px-3 py-1.5 bg-rose-50 hover:bg-rose-500 hover:text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-colors text-rose-600">Del</button>
                    </td>
                  </tr>
                ))}
                {roleManageTab === 'ngos' && ngos.map(n => (
                  <tr key={n.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 font-mono text-xs font-bold text-gray-500">{n.id}</td>
                    <td className="py-4 text-sm font-black text-gray-900">{n.name}</td>
                    <td className="py-4 text-xs font-bold text-gray-500">{n.email}</td>
                    <td className="py-4 text-xs font-bold text-gray-500">{n.area}</td>
                    <td className="py-4 text-right space-x-2">
                       <button onClick={() => setEditingRoleItem({type: 'ngo', data: n})} className="px-3 py-1.5 bg-gray-100 hover:bg-black hover:text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-colors text-black">Edit</button>
                       <button onClick={() => handleDeleteRoleItem('ngo', n.id)} className="px-3 py-1.5 bg-rose-50 hover:bg-rose-500 hover:text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-colors text-rose-600">Del</button>
                    </td>
                  </tr>
                ))}
                {roleManageTab === 'vendors' && cakeVendors.map(v => (
                  <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 font-mono text-xs font-bold text-gray-500">{v.id}</td>
                    <td className="py-4 text-sm font-black text-gray-900">{v.name}</td>
                    <td className="py-4 text-xs font-bold text-gray-500">{v.email}</td>
                    <td className="py-4 text-xs font-bold text-gray-500">{v.area}</td>
                    <td className="py-4 text-right space-x-2">
                       <button onClick={() => setEditingRoleItem({type: 'vendor', data: v})} className="px-3 py-1.5 bg-gray-100 hover:bg-black hover:text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-colors text-black">Edit</button>
                       <button onClick={() => handleDeleteRoleItem('vendor', v.id)} className="px-3 py-1.5 bg-rose-50 hover:bg-rose-500 hover:text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-colors text-rose-600">Del</button>
                    </td>
                  </tr>
                ))}
                {((roleManageTab === 'users' && users.length === 0) || 
                  (roleManageTab === 'ngos' && ngos.length === 0) || 
                  (roleManageTab === 'vendors' && cakeVendors.length === 0)) && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                      No Records Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Editing Modal */}
      {editingRoleItem && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Edit {editingRoleItem.type}</h3>
              <button onClick={() => setEditingRoleItem(null)} className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-rose-500 transition-colors">
                <Icon name="x" size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateRoleItem} className="p-6 space-y-4">
               <div className="space-y-1">
                 <label className="text-[10px] font-black p-1 text-gray-400 uppercase tracking-widest">Name</label>
                 <input required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold focus:bg-white focus:border-black outline-none transition-all" value={editingRoleItem.data.name} onChange={e => setEditingRoleItem({...editingRoleItem, data: {...editingRoleItem.data, name: e.target.value}})} />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black p-1 text-gray-400 uppercase tracking-widest">Email</label>
                 <input type="email" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold focus:bg-white focus:border-black outline-none transition-all" value={editingRoleItem.data.email} onChange={e => setEditingRoleItem({...editingRoleItem, data: {...editingRoleItem.data, email: e.target.value}})} />
               </div>
               {(editingRoleItem.type === 'ngo' || editingRoleItem.type === 'vendor') && (
                 <div className="space-y-1">
                   <label className="text-[10px] font-black p-1 text-gray-400 uppercase tracking-widest">Area</label>
                   <input required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold focus:bg-white focus:border-black outline-none transition-all" value={editingRoleItem.data.area} onChange={e => setEditingRoleItem({...editingRoleItem, data: {...editingRoleItem.data, area: e.target.value}})} />
                 </div>
               )}
               {editingRoleItem.type === 'user' && (
                 <div className="space-y-1">
                   <label className="text-[10px] font-black p-1 text-gray-400 uppercase tracking-widest">Location / Address</label>
                   <input required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold focus:bg-white focus:border-black outline-none transition-all" value={editingRoleItem.data.location} onChange={e => setEditingRoleItem({...editingRoleItem, data: {...editingRoleItem.data, location: e.target.value}})} />
                 </div>
               )}
               <button type="submit" disabled={loading} className="w-full bg-black text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gray-900 transition-all shadow-xl disabled:opacity-50 mt-4">
                 {loading ? 'Processing...' : 'Save Changes'}
               </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmationItem && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-rose-50/50">
              <h3 className="text-lg font-black text-rose-600 uppercase tracking-tight">Confirm Deletion</h3>
              <button disabled={loading} onClick={() => setDeleteConfirmationItem(null)} className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-rose-500 transition-colors">
                <Icon name="x" size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
               <p className="text-sm font-bold text-gray-600">Are you sure you want to permanently delete this {deleteConfirmationItem.type}? This action cannot be undone.</p>
               <div className="flex gap-3">
                 <button disabled={loading} onClick={() => setDeleteConfirmationItem(null)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gray-200 transition-colors">Cancel</button>
                 <button disabled={loading} onClick={executeDeleteRoleItem} className="flex-1 bg-rose-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-rose-700 transition-shadow shadow-xl shadow-rose-500/20">{loading ? 'Deleting...' : 'Delete'}</button>
               </div>
            </div>
          </div>
        </div>
      )}
      
      {activeSection === "Settings" && (
        <div className="animate-in fade-in duration-500 bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Core Framework Settings</h2>
            <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mt-2">Manage Global Parameters & Platform Health</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleSaveSettings} className="w-full max-w-2xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black pl-1 text-gray-400 uppercase tracking-widest">Platform Name</label>
                   <input disabled={savingSettings} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-black outline-none transition-all" value={localSettingsForm.platformName} onChange={e => setLocalSettingsForm({...localSettingsForm, platformName: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black pl-1 text-gray-400 uppercase tracking-widest">Tree Unit Price (₹)</label>
                   <input type="number" disabled={savingSettings} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-black outline-none transition-all font-mono" value={localSettingsForm.treeUnitPrice} onChange={e => setLocalSettingsForm({...localSettingsForm, treeUnitPrice: Number(e.target.value)})} />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black pl-1 text-gray-400 uppercase tracking-widest">Support Email</label>
                   <input type="email" disabled={savingSettings} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-black outline-none transition-all" value={localSettingsForm.supportEmail} onChange={e => setLocalSettingsForm({...localSettingsForm, supportEmail: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black pl-1 text-gray-400 uppercase tracking-widest">Support Phone</label>
                   <input disabled={savingSettings} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-black outline-none transition-all font-mono" value={localSettingsForm.supportPhone} onChange={e => setLocalSettingsForm({...localSettingsForm, supportPhone: e.target.value})} />
                 </div>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 space-y-4">
                 <div className="flex items-center justify-between p-6 bg-rose-50/50 rounded-2xl border border-rose-100">
                    <div>
                      <h4 className="text-sm font-black text-rose-900 uppercase tracking-wide">Maintenance Mode</h4>
                      <p className="text-xs text-rose-600/70 font-bold mt-1 max-w-md">Forces the application offline for users and cake vendors. Admins bypass this block.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" disabled={savingSettings} className="sr-only peer" checked={localSettingsForm.maintenanceMode} onChange={e => setLocalSettingsForm({...localSettingsForm, maintenanceMode: e.target.checked})} />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-rose-500"></div>
                    </label>
                 </div>
              </div>

              <div className="pt-8">
                 <button type="submit" disabled={savingSettings} className="bg-black text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gray-900 transition-all shadow-xl disabled:opacity-50 min-w-[200px]">
                   {savingSettings ? 'Writing to Node...' : 'Commit Settings'}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeSection === "Stories Management" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
            <div className="pl-2">
              <h2 className="text-xl font-black text-gray-900">Stories Management</h2>
              <p className="text-xs text-gray-400 font-medium italic">Manage stories displayed on the public landing page</p>
            </div>
            <button 
              onClick={() => setShowAddStoryModal(true)}
              className="bg-black text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-gray-900 transition-all shadow-sm"
            >
              <Icon name="plus" size={14} /> Add New Story
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {stories.map(story => (
              <div key={story._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
                <img src={story.imageUrl} alt={story.title} className="w-full h-48 object-cover rounded-xl" />
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{story.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-2">{story.content}</p>
                  {story.linkUrl && <a href={story.linkUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 mt-2 block break-all">{story.linkUrl}</a>}
                </div>
                <div className="mt-auto pt-4 border-t border-gray-50 flex justify-end">
                  <button 
                    onClick={async () => {
                      if(window.confirm('Delete this story?')) {
                        setLoading(true);
                        try {
                          await deleteStory(story._id);
                          toast.success('Story deleted');
                          refreshData();
                        } catch(e: any) {
                          toast.error('Failed to delete story');
                        } finally {
                          setLoading(false);
                        }
                      }
                    }}
                    className="text-xs text-rose-500 hover:text-rose-600 font-bold uppercase"
                  >
                    Delete Story
                  </button>
                </div>
              </div>
            ))}
            {stories.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-400 font-medium">No stories found. Create one to display on the landing page!</div>
            )}
          </div>

          {showAddStoryModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
              <div className="bg-white rounded-[40px] w-full max-w-xl overflow-hidden shadow-2xl relative">
                <div className="p-8 pb-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">Add Story</h2>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Publish to Landing Page</p>
                  </div>
                  <button onClick={() => setShowAddStoryModal(false)} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-black transition-all shadow-sm">
                    <Icon name="x" size={16} />
                  </button>
                </div>
                <form 
                  className="p-8 space-y-6"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    try {
                      await createStory(storyFormData);
                      toast.success('Story created successfully');
                      setShowAddStoryModal(false);
                      setStoryFormData({ title: '', content: '', imageUrl: '', linkUrl: '' });
                      refreshData();
                    } catch(err) {
                      toast.error('Failed to create story');
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  <div className="space-y-4">
                    <input required type="text" placeholder="Story Title" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-black outline-none transition-all" value={storyFormData.title} onChange={e => setStoryFormData({...storyFormData, title: e.target.value})} />
                    <textarea required placeholder="Story Content / Description" rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:border-black outline-none transition-all resize-none" value={storyFormData.content} onChange={e => setStoryFormData({...storyFormData, content: e.target.value})} />
                    <input required type="url" placeholder="Image URL (e.g., https://unsplash.com/...)" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:border-black outline-none transition-all" value={storyFormData.imageUrl} onChange={e => setStoryFormData({...storyFormData, imageUrl: e.target.value})} />
                    <input type="url" placeholder="Link URL (Optional link for 'Read More')" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:border-black outline-none transition-all" value={storyFormData.linkUrl} onChange={e => setStoryFormData({...storyFormData, linkUrl: e.target.value})} />
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-black text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-900 transition-all shadow-xl disabled:opacity-50">
                    {loading ? 'Publishing...' : 'Publish Story'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

    </DashboardLayout>
  );
};