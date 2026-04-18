import { Building2, Mail, Phone, MapPin, Calendar, Star, Award, IndianRupee, UserCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '../../../shared/components/ui/avatar';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Label } from '../../../shared/components/ui/label';
import { useCakeUser } from '../CakeUserContext';
import { useCakeData } from '../CakeDataContext';
import { initialsFromName } from '../utils/helpers';

type ShopProfile = {
  shopName: string;
  contactPerson: string;
  email: string;
  phone: string;
  area: string;
  costPerCake: string;
  vendorSince: string;
};

/** Overrides shared `Input` disabled:opacity-50 so read-only shop fields stay dark and readable. */
const shopFieldInputClass =
  'flex-1 border-gray-200 text-[#1F2937] placeholder:text-gray-400 focus-visible:border-[#EC4899] focus-visible:ring-[#EC4899]/30 disabled:cursor-default disabled:opacity-100 disabled:text-[#1F2937] disabled:bg-gray-50';

export function Profile() {
  const cakeUser = useCakeUser();
  const { vendor, summary, deliveries } = useCakeData();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ShopProfile>({
    shopName: '',
    contactPerson: '',
    email: '',
    phone: '',
    area: '',
    costPerCake: '500',
    vendorSince: '—',
  });

  useEffect(() => {
    const cost = vendor?.costPerCake ?? cakeUser.costPerCake;
    setProfile((p) => ({
      ...p,
      shopName: (vendor?.name || cakeUser.name || p.shopName || 'Cake shop') as string,
      contactPerson: (vendor?.contact || cakeUser.contact || p.contactPerson) as string,
      email: (vendor?.email || cakeUser.email || p.email) as string,
      phone: (vendor?.phone || cakeUser.phone || p.phone) as string,
      area: (vendor?.area || cakeUser.area || p.area) as string,
      costPerCake: cost != null ? String(cost) : p.costPerCake,
    }));
  }, [vendor, cakeUser.name, cakeUser.email, cakeUser.phone, cakeUser.area, cakeUser.contact, cakeUser.costPerCake]);

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Shop details saved locally. Contact admin to update records in the system.');
  };

  const shopTitle = profile.shopName.trim() || 'Cake shop';
  const initials = initialsFromName(shopTitle);
  const shopRating = summary?.averageRating ?? 4.8;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1F2937] mb-2">Cake shop profile</h1>
        <p className="text-gray-600">
          Your storefront details for ForestGift cake deliveries — customers see work tied to this shop.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="mb-6">
              <Avatar className="w-24 h-24 mx-auto border-4 border-[#FBCFE8]">
                <AvatarFallback className="bg-gradient-to-br from-[#EC4899] to-[#FBCFE8] text-white text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <Button variant="link" className="text-[#EC4899] hover:text-[#DB2777] mt-2 text-sm">
                Change shop logo
              </Button>
            </div>

            <h2 className="text-xl font-bold text-[#1F2937] mb-1 px-1">{shopTitle}</h2>
            <p className="text-sm text-gray-600 mb-1">Cake shop</p>
            {profile.contactPerson ? (
              <p className="text-xs text-gray-500 mb-4">
                Primary contact: <span className="font-medium text-gray-700">{profile.contactPerson}</span>
              </p>
            ) : (
              <p className="text-xs text-gray-500 mb-4">Add a primary contact in shop details.</p>
            )}

            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#EC4899]">{deliveries.length}</p>
                <p className="text-xs text-gray-600">Assigned deliveries</p>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="text-center">
                <div className="flex items-center gap-1 justify-center">
                  <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                  <p className="text-2xl font-bold text-[#F59E0B]">{shopRating.toFixed(1)}</p>
                </div>
                <p className="text-xs text-gray-600">Shop rating</p>
              </div>
            </div>

            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-[#EC4899] shrink-0" />
                <span>Vendor since {profile.vendorSince}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Award className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Verified ForestGift cake vendor</span>
              </div>
              {vendor?.id && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Building2 className="w-4 h-4 text-[#EC4899] shrink-0" />
                  <span>
                    Shop ID: <span className="font-mono font-medium text-[#1F2937]">{vendor.id}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
              <div className="flex items-center gap-3 min-w-0">
                <Building2 className="w-6 h-6 text-[#EC4899] shrink-0" />
                <h2 className="text-xl font-semibold text-[#1F2937]">Shop details</h2>
              </div>
              <Button
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                className={
                  isEditing
                    ? 'bg-[#10B981] hover:bg-[#059669] text-white'
                    : 'bg-[#EC4899] hover:bg-[#DB2777] text-white'
                }
              >
                {isEditing ? 'Save' : 'Edit shop'}
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="shopName" className="text-sm font-medium text-gray-700 mb-1">
                    Shop name
                  </Label>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
                    <Input
                      id="shopName"
                      value={profile.shopName}
                      onChange={(e) => setProfile({ ...profile, shopName: e.target.value })}
                      disabled={!isEditing}
                      className={shopFieldInputClass}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="contactPerson" className="text-sm font-medium text-gray-700 mb-1">
                    Primary contact (person)
                  </Label>
                  <div className="flex items-center gap-2">
                    <UserCircle className="w-4 h-4 text-gray-400 shrink-0" />
                    <Input
                      id="contactPerson"
                      value={profile.contactPerson}
                      onChange={(e) => setProfile({ ...profile, contactPerson: e.target.value })}
                      disabled={!isEditing}
                      className={shopFieldInputClass}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1">
                    Business email
                  </Label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      disabled={!isEditing}
                      className={shopFieldInputClass}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-1">
                    Shop phone
                  </Label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      disabled={!isEditing}
                      className={shopFieldInputClass}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="area" className="text-sm font-medium text-gray-700 mb-1">
                    Service area / coverage
                  </Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                    <Input
                      id="area"
                      value={profile.area}
                      onChange={(e) => setProfile({ ...profile, area: e.target.value })}
                      disabled={!isEditing}
                      className={shopFieldInputClass}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="costPerCake" className="text-sm font-medium text-gray-700 mb-1">
                    Cost per cake (₹)
                  </Label>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-gray-400 shrink-0" />
                    <Input
                      id="costPerCake"
                      inputMode="numeric"
                      value={profile.costPerCake}
                      onChange={(e) => setProfile({ ...profile, costPerCake: e.target.value })}
                      disabled={!isEditing}
                      className={shopFieldInputClass}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-[#F59E0B]" />
              <h2 className="text-xl font-semibold text-[#1F2937]">Shop performance</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-[#EC4899]/10 to-[#FBCFE8]/10">
                <p className="text-2xl font-bold text-[#EC4899] mb-1">{deliveries.length}</p>
                <p className="text-xs text-gray-600">Total deliveries</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-[#10B981]/10 to-[#34D399]/10">
                <p className="text-2xl font-bold text-[#10B981] mb-1">
                  {summary ? `${summary.successRate}%` : '—'}
                </p>
                <p className="text-xs text-gray-600">Success rate</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-[#F59E0B]/10 to-[#FCD34D]/10">
                <p className="text-2xl font-bold text-[#F59E0B] mb-1">{shopRating.toFixed(1)}</p>
                <p className="text-xs text-gray-600">Avg rating</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-[#8B5CF6]/10 to-[#C4B5FD]/10">
                <p className="text-2xl font-bold text-[#8B5CF6] mb-1">{summary?.totalTrees ?? '—'}</p>
                <p className="text-xs text-gray-600">Trees (your customers)</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-[#EC4899]" />
              <h2 className="text-xl font-semibold text-[#1F2937]">Shop highlights</h2>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-[#EC4899] to-[#FBCFE8] text-white text-sm font-medium shadow-md">
                🏆 Trusted bakery
              </div>
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-[#10B981] to-[#34D399] text-white text-sm font-medium shadow-md">
                🌳 ForestGift partner
              </div>
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] text-white text-sm font-medium shadow-md">
                ⭐ Top-rated shop
              </div>
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#C4B5FD] text-white text-sm font-medium shadow-md">
                🚀 Reliable deliveries
              </div>
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#93C5FD] text-white text-sm font-medium shadow-md">
                💯 Consistent service
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
