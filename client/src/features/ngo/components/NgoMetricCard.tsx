import type { LucideIcon } from 'lucide-react';

type NgoMetricCardProps = {
  icon: LucideIcon;
  title: string;
  value: string | number;
  gradient?: string;
};

export function NgoMetricCard({ icon: Icon, title, value, gradient }: NgoMetricCardProps) {
  const gradientClass = gradient || 'from-[#b2d8d0] to-[#d4ebe6]';

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-[#b2d8d0]/40">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-semibold text-[#1F2937]">{value}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center shadow-sm`}
        >
          <Icon className="w-6 h-6 text-[#2d6a62]" />
        </div>
      </div>
      <div className={`mt-4 h-1 rounded-full bg-gradient-to-r ${gradientClass} opacity-50`} />
    </div>
  );
}
