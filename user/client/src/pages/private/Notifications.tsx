import type React from "react";
import { useState, useMemo } from "react";
import {
  Bell,
  ArrowLeft,
  MailOpen,
  Mail,
  Inbox,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// === Types ===
interface Notification {
  id: number;
  title: string;
  date: string;
  message: string;
  read: boolean;
}

// === Dummy Data ===
const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "Product Approved: Ultimate Guide to E-commerce",
    date: "2025-09-28",
    message:
      "Congratulations! Your product, 'The Ultimate Guide to E-commerce Success', has been reviewed and approved by our AI system. It is now live on the marketplace. You can start promoting it immediately.",
    read: false,
  },
  {
    id: 2,
    title: "New Affiliate Earned Commission",
    date: "2025-09-29",
    message:
      "A new sale was recorded for your product through an affiliate link. Commission amount: ₦1,250. Check your Live Dashboard for full details on the transaction and affiliate. This message confirms the successful tracking and payout process for affiliate sales, which is a key part of leveraging our promoter network to maximize your earnings on Saerv.",
    read: false,
  },
  {
    id: 3,
    title: "System Update: Faster Payouts and Fee Structure Adjustment",
    date: "2025-09-25",
    message:
      "We've upgraded our payment processing system to use a new API, which enables instant payouts for all Pro and Premium users within minutes, 24/7. However, due to increased banking transaction costs associated with this speed, the platform fee on withdrawal for Pro accounts will be slightly adjusted from 10% to 12.5% starting October 15th. Premium accounts will remain at 5%. We believe this change balances speed and service cost effectively.",
    read: true,
  },
  {
    id: 4,
    title: "Weekly Sales Report Available",
    date: "2025-09-22",
    message:
      "Your weekly performance report for the period ending September 21st is ready. You had 5 sales and 45 clicks this week. Log in to view detailed analytics.",
    read: true,
  },
  {
    id: 5,
    title: "Action Required: Update Payout Information",
    date: "2025-10-01",
    message:
      "We noticed your bank details might be outdated. Please navigate to your Settings > Payouts to confirm or update your banking information to ensure timely withdrawal of your earnings.",
    read: false,
  },
];

// === Empty State Component ===
const EmptyNotifications = () => {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <Inbox className="w-8 h-8 text-muted-foreground" />
        </div>
        <CardTitle className="text-xl mb-2 text-center text-balance">
          No Notifications
        </CardTitle>
        <CardDescription className="text-center max-w-sm text-pretty">
          You're all caught up! When you receive new notifications, they'll
          appear here.
        </CardDescription>
      </CardContent>
    </Card>
  );
};

// === Notification Item Component ===
interface NotificationItemProps {
  notification: Notification;
  onSelect: (notification: Notification) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onSelect,
}) => {
  const isUnread = !notification.read;

  return (
    <Card
      className={`cursor-pointer transition-colors hover:bg-accent/50 ${
        isUnread ? "bg-accent/30 border-primary/20" : ""
      }`}
      onClick={() => onSelect(notification)}
      role="button"
      tabIndex={0}
      aria-label={`Notification: ${notification.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(notification);
        }
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <div
            className={`flex-shrink-0 mt-1 ${
              isUnread ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {isUnread ? (
              <Mail className="w-5 h-5" />
            ) : (
              <MailOpen className="w-5 h-5" />
            )}
          </div>

          <div className="flex-grow min-w-0">
            <CardTitle
              className={`text-base leading-snug mb-1 ${
                isUnread ? "font-semibold" : "font-medium"
              }`}
            >
              {notification.title}
            </CardTitle>
            <CardDescription className="text-sm">
              {new Date(notification.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </CardDescription>
          </div>

          {isUnread && (
            <span
              className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"
              aria-hidden="true"
            />
          )}
        </div>
      </CardHeader>
    </Card>
  );
};

// === Notification Detail Component ===
interface NotificationDetailProps {
  notification: Notification;
  onBack: () => void;
}

const NotificationDetail: React.FC<NotificationDetailProps> = ({
  notification,
  onBack,
}) => {
  const dateString = new Date(notification.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="h-full">
      <CardHeader className="space-y-4">
        <Button variant="ghost" onClick={onBack} className="w-fit -ml-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Inbox
        </Button>

        <div className="space-y-2 border-b border-border pb-4">
          <CardTitle className="text-2xl leading-tight text-balance">
            {notification.title}
          </CardTitle>
          <CardDescription className="flex items-center gap-1">
            <CalendarDays className="w-4 h-4" /> {dateString}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Full Message:</h3>
          <div className="text-sm leading-relaxed bg-muted/50 p-4 rounded-lg border border-border whitespace-pre-wrap">
            {notification.message}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// === Main Notifications Page Component ===
const NotificationsPage = () => {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const handleSelectNotification = (notification: Notification) => {
    setSelectedNotification(notification);

    if (!notification.read) {
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n.id === notification.id ? { ...n, read: true } : n
        )
      );
    }
  };

  const handleBackToInbox = () => {
    setSelectedNotification(null);
  };

  const handleMarkAllRead = () => {
    setNotifications((n) => n.map((item) => ({ ...item, read: true })));
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {selectedNotification ? (
          <NotificationDetail
            notification={selectedNotification}
            onBack={handleBackToInbox}
          />
        ) : (
          <div className="space-y-6">
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Notifications
                </h1>
              </div>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="w-fit">
                  {unreadCount} unread
                </Badge>
              )}
            </header>

            <div className="space-y-3">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onSelect={handleSelectNotification}
                  />
                ))
              ) : (
                <EmptyNotifications />
              )}
            </div>

            {unreadCount > 0 && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="outline"
                  onClick={handleMarkAllRead}
                  className="w-full sm:w-auto bg-transparent"
                >
                  Mark All as Read
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
