import React, { useEffect, useState } from 'react';
import { Building2, User, Mail, Phone, Calendar } from 'lucide-react';

export type ProfilePageProps = {
  ngoData: any;
  onUpdate: (updates: any) => Promise<void>;
};

export const ProfilePage = ({ ngoData, onUpdate }: ProfilePageProps) => {
  const [form, setForm] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    area: '',
  });
  const [isEdit, setIsEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!ngoData) return;

    setForm({
      name: ngoData.name ?? ngoData.ngo_name ?? '',
      contact: ngoData.contact ?? '',
      email: ngoData.email ?? '',
      phone: ngoData.phone ?? '',
      area: ngoData.area ?? '',
    });
  }, [ngoData]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(form);
      window.alert('Profile saved');
      setIsEdit(false);
    } catch (error) {
      window.alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (ngoData) {
      setForm({
        contact: ngoData.contact ?? '',
        email: ngoData.email ?? '',
        phone: ngoData.phone ?? '',
        area: ngoData.area ?? '',
      });
    }
    setIsEdit(false);
  };

  if (!ngoData) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  return (
    <div className="max-w-3xl">
      <div className="bg-white rounded-2xl border border-[#b2d8d0]/50 shadow-sm p-8">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
          <div className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center text-3xl font-bold">
            {ngoData.ngo_name?.charAt(0) || 'N'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{ngoData.ngo_name}</h2>
            <p className="text-sm text-gray-500 mt-1">NGO Partner</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4" />
                Organization Name
              </div>
              {isEdit ? (
                <input
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3"
                />
              ) : (
                <p className="text-base font-medium text-gray-900" data-testid="profile-ngo-name">
                    {(ngoData.name ?? ngoData.ngo_name) || '-'}
                </p>
              )}
            </div>

            <div>
              <div className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                <User className="w-4 h-4" />
                Contact Person
              </div>
              {isEdit ? (
                <input
                  value={form.contact}
                  onChange={(e) => setForm((prev) => ({ ...prev, contact: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3"
                />
              ) : (
                <p className="text-base font-medium text-gray-900" data-testid="profile-contact-person">
                  {ngoData.contact || '-'}
                </p>
              )}
            </div>

            <div>
              <div className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              {isEdit ? (
                <input
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3"
                />
              ) : (
                <p className="text-base font-medium text-gray-900" data-testid="profile-email">
                  {ngoData.email || '-'}
                </p>
              )}
            </div>

            <div>
              <div className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </div>
              {isEdit ? (
                <input
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3"
                />
              ) : (
                <p className="text-base font-medium text-gray-900" data-testid="profile-phone">
                  {ngoData.phone || '-'}
                </p>
              )}
            </div>

            <div>
              <div className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4" />
                Member Since
              </div>
              <p className="text-base font-medium text-gray-900" data-testid="profile-created-at">
                {formatDate(ngoData.created_at || ngoData.createdAt)}
              </p>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4" />
                Region
              </div>
              {isEdit ? (
                <input
                  value={form.area}
                  onChange={(e) => setForm((prev) => ({ ...prev, area: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3"
                />
              ) : (
                <p className="text-base font-medium text-gray-900">{ngoData.area || '-'}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsEdit((prev) => !prev)}
              className="text-sm font-semibold text-gray-600 hover:text-black"
            >
              {isEdit ? 'Cancel' : 'Edit'}
            </button>
            {isEdit && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-900/10"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
