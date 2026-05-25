export type CakeNotificationRow = {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
};

/** Live notifications can be wired to API later; no static dummy rows. */
export function createInitialCakeNotifications(): CakeNotificationRow[] {
  return [];
}
