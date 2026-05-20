import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  gradient?: string;
  emoji?: string;
}

export function MetricCard({ icon: Icon, title, value, gradient, emoji }: MetricCardProps) {
  const gradientClass = gradient || 'from-[#EC4899] to-[#FBCFE8]';

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-semibold text-[#1F2937]">{value}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center shadow-lg`}
        >
          {emoji ? <span className="text-2xl">{emoji}</span> : <Icon className="w-6 h-6 text-white" />}
        </div>
      </div>
      <div className={`mt-4 h-1 rounded-full bg-gradient-to-r ${gradientClass} opacity-20`} />
    </div>
  );
}
