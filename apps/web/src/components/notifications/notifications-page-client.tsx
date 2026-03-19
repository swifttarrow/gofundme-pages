"use client";

import { useEffect, useState } from "react";
import { NotificationList } from "@/components/notifications/notification-list";
import { AppNotification, AuthUser, getCurrentUser, getNotifications } from "@/lib/api";
import { APP_DATA_REFRESH_EVENT } from "@/lib/client-events";

export function NotificationsPageClient() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const { user } = await getCurrentUser();
        if (cancelled) return;
        setCurrentUser(user);

        const result = await getNotifications({ userId: user.id, limit: 50 });
        if (!cancelled) {
          setNotifications(result.notifications);
        }
      } catch {
        if (!cancelled) {
          setCurrentUser(null);
          setNotifications([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void load();
    window.addEventListener(APP_DATA_REFRESH_EVENT, load);

    return () => {
      cancelled = true;
      window.removeEventListener(APP_DATA_REFRESH_EVENT, load);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="py-12 text-center text-text-muted">
            <p>Loading notifications...</p>
          </div>
        ) : currentUser ? (
          <NotificationList currentUserId={currentUser.id} notifications={notifications} />
        ) : (
          <div className="py-12 text-center text-text-muted">
            <p>Sign in to view your notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
}
