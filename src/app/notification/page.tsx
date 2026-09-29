"use client";

import {
  GetNotifications,
  MarkNotificationsAsRead,
} from "@/actions/notification-action";
import NotificationSkeleton from "@/components/Notification/NotificationSkeleton";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { HeartIcon, MessageCircleIcon, UserPlusIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Notifications = Awaited<ReturnType<typeof GetNotifications>>;
// type Notification = NonNullable<Notifications[number]>

const Page = () => {
  const getNotificationIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case "LIKE":
        return <HeartIcon className="size-4 text-red-500" />;
      case "COMMENT":
        return <MessageCircleIcon className="size-4 text-blue-500" />;
      case "FOLLOW":
        return <UserPlusIcon className="size-4 text-green-500" />;
      default:
        return null;
    }
  };

  const [notification, setNotification] = useState<Notifications>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("first");

    const FetchNotifications = async () => {
      try {
        const data = await GetNotifications();
        console.log(data);
        setNotification(data);

        const unreadIds = data.filter((ntf) => !ntf.read).map((ntf) => ntf.id);

        if (unreadIds.length > 0) await MarkNotificationsAsRead(unreadIds);
      } catch (error) {
        toast.error("Failed to fetch Notification");
        console.error("FetchNotification: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    FetchNotifications();
  }, []);

  if (isLoading) return <NotificationSkeleton />;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Notifications</CardTitle>
            <span className="text-sm text-muted-foreground">
              {notification.filter((n) => !n.read).length} unread
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            {notification.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No notifications yet
              </div>
            ) : (
              notification.map((noti) => (
                <div
                  key={noti.id}
                  className={`flex items-start gap-4 p-4 border-b hover:bg-muted/25 transition-colors ${
                    !noti.read ? "bg-muted/50" : ""
                  }`}
                >
                  <Avatar className="mt-1">
                    <AvatarImage src={noti.creator.image ?? "/avatar.png"} />
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      {getNotificationIcon(noti.type)}
                      <span>
                        <span className="font-medium">
                          {noti.creator.name ?? noti.creator.username}
                        </span>{" "}
                        {noti.type === "FOLLOW"
                          ? "started following you"
                          : noti.type === "Like"
                            ? "liked your post"
                            : "commented on your post"}
                      </span>
                    </div>

                    {noti.post &&
                      (noti.type === "Like" || noti.type === "Comment") && (
                        <div className="pl-6 space-y-2">
                          <div className="text-sm text-muted-foreground rounded-md p-2 bg-muted/30 mt-2">
                            <p>{noti.post.content}</p>
                            {noti.post.image && (
                              <Image
                                src={noti.post.image}
                                alt="Post content"
                                className="mt-2 rounded-md w-full max-w-50 h-auto object-cover"
                              />
                            )}
                          </div>

                          {noti.type === "Comment" && noti.comment && (
                            <div className="text-sm p-2 bg-accent/50 rounded-md">
                              {noti.comment.content}
                            </div>
                          )}
                        </div>
                      )}

                    <p className="text-sm text-muted-foreground pl-6">
                      {formatDistanceToNow(new Date(noti.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
