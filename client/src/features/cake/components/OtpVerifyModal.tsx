import { useState } from 'react';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Label } from '../../../shared/components/ui/label';

type OtpVerifyModalProps = {
  open: boolean;
  customerName: string;
  orderId: string;
  onClose: () => void;
  onVerify: (otp: string) => Promise<void>;
};

export function OtpVerifyModal({ open, customerName, orderId, onClose, onVerify }: OtpVerifyModalProps) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (otp.trim().length !== 6) return;
    setLoading(true);
    try {
      await onVerify(otp.trim());
      setOtp('');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/45">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold text-[#1F2937]">Verify delivery OTP</h3>
        <p className="text-sm text-gray-600 mt-1">
          Ask <span className="font-semibold">{customerName}</span> for the 6-digit code sent to their email.
        </p>
        <p className="text-xs text-[#EC4899] font-mono mt-2">{orderId}</p>
        <div className="mt-5 space-y-2">
          <Label htmlFor="delivery-otp">6-digit OTP</Label>
          <Input
            id="delivery-otp"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="text-center text-2xl tracking-[0.4em] font-bold border-[#FBCFE8] focus-visible:ring-[#EC4899]"
            placeholder="000000"
          />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            className="bg-[#10B981] hover:bg-[#059669]"
            disabled={loading || otp.length !== 6}
            onClick={() => void handleSubmit()}
          >
            {loading ? 'Verifying…' : 'Confirm delivered'}
          </Button>
        </div>
      </div>
    </div>
  );
}
