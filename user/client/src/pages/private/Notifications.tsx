import type React from "react";
import { useState, useMemo, useEffect } from "react";
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
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";
import handleError from "@/utils/handleError";
import LoadMore from "@/components/load-more";
import { Skeleton } from "@/components/ui/skeleton";
import { useApp } from "@/contexts/app";

// === Types ===
interface Notification {
  id: number;
  subject: string;
  date: string;
  message: string;
  isRead: boolean;
}

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
  const isUnread = !notification.isRead;

  return (
    <Card
      className={`cursor-pointer transition-colors hover:bg-accent/50 ${
        isUnread ? "bg-accent/30 border-primary/20" : ""
      }`}
      onClick={() => onSelect(notification)}
      role="button"
      tabIndex={0}
      aria-label={`Notification: ${notification.subject}`}
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
              {notification.subject}
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
            {notification.subject}
          </CardTitle>
          <CardDescription className="flex items-center gap-1">
            <CalendarDays className="w-4 h-4" /> {dateString}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Full Message:</h3>
          <div
            className="text-sm leading-relaxed bg-muted/50 p-4 rounded-lg border border-border"
            dangerouslySetInnerHTML={{ __html: notification.message }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

// === Main Notifications Page Component ===
const NotificationsPage = () => {
  const { axios } = useAuth();
  const { setUnread } = useApp();

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  useEffect(() => {
    const fetchNotifications = async (page: number, limit: number = 20) => {
      setLoading(true);
      try {
        const { data } = await axios.get("/notification/fetch", {
          params: { page: String(page), limit: String(limit) },
        });

        if (data.success) {
          setNotifications((prev) =>
            page === 1 ? data.notifications : [...prev, ...data.notifications]
          );
          setTotalPages(data.totalPages);
        } else toast.error(data.message);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications(page);
    // eslint-disable-next-line
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const handleSelectNotification = async (notification: Notification) => {
    setSelectedNotification(notification);

    if (!notification.isRead) {
      try {
        const { data } = await axios.post("/notification/read", {
          id: notification.id,
        });
        if (data.success) {
          setNotifications((prevNotifications) =>
            prevNotifications.map((n) =>
              n.id === notification.id ? { ...n, isRead: true } : n
            )
          );
        } else toast.error(data.message);
      } catch (err) {
        handleError(err);
      }
    }
  };

  const handleBackToInbox = () => {
    setSelectedNotification(null);
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const { data } = await axios.post("/notification/read-all");
      if (data.success) {
        setNotifications((n) => n.map((item) => ({ ...item, isRead: true })));
        setUnread(0);
      } else toast.error(data.message);
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div className="min-h-screen bg-background p-2 md:p-6 lg:p-8">
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
              {notifications.length > 0 &&
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onSelect={handleSelectNotification}
                  />
                ))}

              {notifications.length === 0 && !loading && <EmptyNotifications />}
              {notifications.length === 0 && loading && (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-30" />
                  ))}
                </div>
              )}
            </div>

            {page < totalPages && (
              <LoadMore onClick={handleLoadMore} loading={loading} />
            )}

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
