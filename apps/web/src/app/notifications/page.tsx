import { SEED_NOTIFICATIONS } from "@/lib/seed-data";
import { NotificationList } from "@/components/notifications/notification-list";

export const metadata = {
  title: "Notifications | GoSupportMe",
};

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <NotificationList notifications={SEED_NOTIFICATIONS} />
      </div>
    </div>
  );
}
