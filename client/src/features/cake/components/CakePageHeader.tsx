import type { LucideIcon } from 'lucide-react';

type CakePageHeaderProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
};

export function CakePageHeader({ title, description, icon: Icon, actions }: CakePageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
      <div className="flex items-start gap-3">
        {Icon ? (
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#EC4899] to-[#FBCFE8] flex items-center justify-center shadow-sm shrink-0">
            <Icon className="w-5 h-5 text-white" />
          </div>
        ) : null}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">{title}</h1>
          {description ? <p className="text-gray-600 text-sm mt-1">{description}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
