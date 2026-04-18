import { Plus, Phone, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../../../shared/components/ui/button';

export function QuickActions() {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: Phone,
      label: 'Call Support',
      color: 'from-[#10B981] to-[#34D399]',
      action: () => {
        toast.info('Calling support...', { description: '+1 (800) 123-4567' });
        setIsOpen(false);
      },
    },
    {
      icon: HelpCircle,
      label: 'Help',
      color: 'from-[#F59E0B] to-[#FCD34D]',
      action: () => {
        toast.info('Help Center', { description: 'Opening help documentation' });
        setIsOpen(false);
      },
    },
  ];

  return (
    <div className="fixed bottom-20 right-6 z-40 md:bottom-8">
      {isOpen && (
        <div className="absolute bottom-16 right-0 flex flex-col gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                type="button"
                onClick={action.action}
                className={`flex items-center gap-3 bg-gradient-to-r ${action.color} text-white px-4 py-3 rounded-full shadow-lg hover:scale-105 transition-all`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm whitespace-nowrap">{action.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-xl hover:shadow-2xl transition-all ${
          isOpen
            ? 'bg-gray-700 hover:bg-gray-800 rotate-45'
            : 'bg-gradient-to-r from-[#EC4899] to-[#FBCFE8] hover:scale-110'
        }`}
      >
        <Plus className="w-6 h-6 text-white" />
      </Button>
    </div>
  );
}
