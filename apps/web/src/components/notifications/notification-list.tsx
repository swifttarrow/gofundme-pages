"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SeedNotification, timeAgo } from "@/lib/seed-data";

const TABS = [
  { label: "All", value: "all" },
  { label: "My Fundraisers", value: "fundraisers" },
  { label: "Donations", value: "donations" },
  { label: "Community", value: "community" },
  { label: "Archived", value: "archived" },
];

const TYPE_ICONS: Record<string, React.ReactNode> = {
  fundraiser_milestone: (
    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
        <polyline points="17,6 23,6 23,12" />
      </svg>
    </div>
  ),
  fundraiser_update: (
    <div className="w-8 h-8 rounded-full bg-accent-blue flex items-center justify-center">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </div>
  ),
  donation_received: (
    <div className="w-8 h-8 rounded-full bg-accent-orange/20 flex items-center justify-center">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </div>
  ),
  community_activity: (
    <div className="w-8 h-8 rounded-full bg-bg-gray flex items-center justify-center">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B6B6B" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    </div>
  ),
};

interface NotificationListProps {
  notifications: SeedNotification[];
}

export function NotificationList({ notifications }: NotificationListProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [readIds, setReadIds] = useState<Set<string>>(
    new Set(notifications.filter((n) => n.isRead).map((n) => n.id))
  );

  const filtered = notifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "fundraisers")
      return ["fundraiser_milestone", "fundraiser_update"].includes(n.type);
    if (activeTab === "donations") return n.type === "donation_received";
    if (activeTab === "community") return n.type === "community_activity";
    if (activeTab === "archived") return readIds.has(n.id);
    return true;
  });

  function markRead(id: string) {
    setReadIds((prev) => new Set([...prev, id]));
  }

  function markAllRead() {
    setReadIds(new Set(notifications.map((n) => n.id)));
  }

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-text-primary">Notifications</h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-sm text-primary font-medium hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 mb-4 border-b border-border-light no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`pb-3 px-3 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors ${
              activeTab === tab.value
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications */}
      <div className="space-y-1">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-text-muted">
            <p>No notifications yet.</p>
          </div>
        ) : (
          filtered.map((notification) => (
            <NotificationRow
              key={notification.id}
              notification={notification}
              isRead={readIds.has(notification.id)}
              onRead={() => markRead(notification.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface NotificationRowProps {
  notification: SeedNotification;
  isRead: boolean;
  onRead: () => void;
}

function NotificationRow({ notification, isRead, onRead }: NotificationRowProps) {
  const router = useRouter();

  function handleRowClick() {
    onRead();
    router.push(notification.deepLink);
  }

  return (
    <div
      className={`flex gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
        !isRead ? "bg-primary-light border border-primary/10" : "hover:bg-bg-faint"
      }`}
      onClick={handleRowClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleRowClick();
        }
      }}
      role="link"
      tabIndex={0}
    >
      {/* Unread dot */}
      <div className="flex-shrink-0 flex flex-col items-center gap-1 pt-1">
        {!isRead && (
          <div className="w-2 h-2 rounded-full bg-primary" />
        )}
        {isRead && <div className="w-2" />}
      </div>

      {/* Icon */}
      <div className="flex-shrink-0">
        {TYPE_ICONS[notification.type] ?? TYPE_ICONS.community_activity}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary leading-snug">
          {notification.title}
        </p>
        <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">
          {notification.body}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <Link
            href={notification.deepLink}
            className="text-xs text-primary font-medium hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              onRead();
            }}
          >
            View →
          </Link>
          <span className="text-xs text-text-muted">·</span>
          <span className="text-xs text-text-muted">{notification.reasonText}</span>
        </div>
        <p className="text-xs text-text-muted mt-1">{timeAgo(notification.createdAt)}</p>
      </div>
    </div>
  );
}
