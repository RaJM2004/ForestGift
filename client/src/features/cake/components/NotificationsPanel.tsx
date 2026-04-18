import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { Button } from '../../../shared/components/ui/button';
import type { CakeNotificationRow } from '../data/notifications';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: CakeNotificationRow[];
  onMarkAllRead: () => void;
  onMarkOneRead: (id: number) => void;
}

export function NotificationsPanel({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onMarkOneRead,
}: NotificationsPanelProps) {
  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  const handleMarkAllRead = () => {
    if (unreadCount === 0) {
      toast.message('You are all caught up.');
      return;
    }
    onMarkAllRead();
    toast.success('All notifications marked as read');
  };

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[200] bg-black/30 backdrop-blur-[1px]"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        role="presentation"
        aria-hidden
      />

      <div
        className="fixed left-3 right-3 top-28 sm:left-auto sm:right-6 sm:top-28 md:right-8 w-auto sm:w-96 max-w-[calc(100vw-1.5rem)] sm:max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl z-[201] border border-gray-200 flex flex-col max-h-[min(520px,calc(100dvh-8rem))] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cake-notifications-title"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0 bg-white">
          <div>
            <h3 id="cake-notifications-title" className="font-semibold text-[#1F2937] text-lg">
              Notifications
            </h3>
            <p className="text-xs text-gray-500">{unreadCount} unread</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white !text-gray-900 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EC4899]"
            aria-label="Close notifications"
          >
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto p-2 flex-1 min-h-0 bg-white">
          {notifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <button
                key={notification.id}
                type="button"
                onClick={() => notification.unread && onMarkOneRead(notification.id)}
                className={`w-full p-4 rounded-xl mb-2 text-left transition-all hover:bg-gray-50 ${
                  notification.unread ? 'bg-[#FDF2F8]' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${notification.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-[#1F2937] text-sm">{notification.title}</h4>
                      {notification.unread && (
                        <div className="w-2 h-2 rounded-full bg-[#EC4899] flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.description}</p>
                    <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-100 shrink-0 bg-white">
          <Button
            variant="outline"
            className="w-full !text-gray-900 border-[#EC4899]/30 hover:bg-[#FDF2F8] hover:text-[#DB2777]"
            type="button"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
          >
            Mark all as read
          </Button>
        </div>
      </div>
    </>,
    document.body,
  );
}
