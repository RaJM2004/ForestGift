import type { LucideIcon } from 'lucide-react';
import { Bell, Package, Star, TrendingUp } from 'lucide-react';

export type CakeNotificationRow = {
  id: number;
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
  color: string;
  unread: boolean;
};

export function createInitialCakeNotifications(): CakeNotificationRow[] {
  return [
    {
      id: 1,
      icon: Package,
      title: 'New Delivery Request',
      description: 'Sarah Johnson requested delivery for tomorrow at 2:00 PM',
      time: '5 minutes ago',
      color: 'from-[#EC4899] to-[#FBCFE8]',
      unread: true,
    },
    {
      id: 2,
      icon: Star,
      title: 'New 5-Star Rating',
      description: 'Michael Chen left you a 5-star review!',
      time: '1 hour ago',
      color: 'from-[#F59E0B] to-[#FCD34D]',
      unread: true,
    },
    {
      id: 3,
      icon: TrendingUp,
      title: 'Milestone Achieved!',
      description: 'Congratulations! You reached 25 deliveries this month',
      time: '3 hours ago',
      color: 'from-[#10B981] to-[#34D399]',
      unread: true,
    },
    {
      id: 4,
      icon: Bell,
      title: 'Reminder',
      description: 'You have 3 deliveries scheduled for today',
      time: 'Yesterday',
      color: 'from-[#3B82F6] to-[#93C5FD]',
      unread: false,
    },
  ];
}
