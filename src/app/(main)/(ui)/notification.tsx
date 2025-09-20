"use client";

import { FC, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as customDialog from "@/components/ui/dialog";
import { Bell, MoreVertical, Trash } from "lucide-react";
import { useSidebar } from "../(lib)/useSidebar";
import { NotificationListSkeleton } from "./skeletonss/notification-list-skeleton";
import { INotification } from "../(lib)/sidebar-types";

const Notification: FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const {
    isNotificationLoading,
    notifications,
    handleNotificationRequest,
    handleDeleteNotification,
  } = useSidebar({ onSuccess: () => setOpenId(null) });

  console.log(notifications);

  return (
    <div className="relative mt-2">
      <DropdownMenu>
        <DropdownMenuTrigger className="relative">
          <Bell className="mr-2 h-4 w-4 cursor-pointer sm:h-6 sm:w-6" />
          {/* Notification badge */}
          <div className="bg-primary absolute -top-1.5 right-1 flex h-4 w-4 items-center justify-center rounded-full">
            <span className="text-primary-foreground text-[9px]">
              {isNotificationLoading ? "..." : notifications.data.length}
            </span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="bg-secondary max-h-[60dvh] w-80 p-2"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="text-primary mb-2 px-2 py-1.5 font-semibold">
            Notifications
          </div>
          {isNotificationLoading ? (
            <NotificationListSkeleton />
          ) : notifications.data.length === 0 ? (
            <div className="text-muted-foreground flex items-center justify-center p-4 text-sm">
              No notifications
            </div>
          ) : (
            notifications?.data?.map((notification: INotification) => (
              <div key={notification.id} className="flex items-center">
                <customDialog.Dialog
                  open={openId === notification.id}
                  onOpenChange={(open) =>
                    setOpenId(open ? notification.id : null)
                  }
                >
                  <customDialog.DialogTrigger asChild>
                    <div className="hover:bg-border focus:bg-border flex-1 cursor-pointer rounded-md p-2">
                      <div className="flex flex-col gap-1">
                        <div className="text-muted text-xs">
                          {notification.description}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {notification.time}
                        </div>
                      </div>
                    </div>
                  </customDialog.DialogTrigger>
                  <customDialog.DialogContent>
                    <customDialog.DialogHeader>
                      <customDialog.DialogTitle>
                        {notification.hasResponse ? (
                          <div className="flex items-center gap-2">
                            {notification.title}
                            <span className="text-primary text-sm">
                              (Already Responded)
                            </span>
                          </div>
                        ) : (
                          notification.title
                        )}
                      </customDialog.DialogTitle>
                      <customDialog.DialogDescription>
                        {notification.description}
                      </customDialog.DialogDescription>
                    </customDialog.DialogHeader>
                    {!notification.hasResponse && (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            handleNotificationRequest({
                              topicRequestId: notification.topicId,
                              res: {
                                status: "rejected",
                                notificationId: notification.id,
                              },
                            })
                          }
                          className="bg-destructive text-destructive-foreground cursor-pointer rounded-md px-4 py-2 text-sm"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() =>
                            handleNotificationRequest({
                              topicRequestId: notification.topicId,
                              res: {
                                status: "accepted",
                                notificationId: notification.id,
                              },
                            })
                          }
                          className="bg-primary text-primary-foreground cursor-pointer rounded-md px-4 py-2 text-sm"
                        >
                          Accept
                        </button>
                      </div>
                    )}
                  </customDialog.DialogContent>
                </customDialog.Dialog>

                <div className="ml-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none">
                      <div className="hover:bg-border text-muted/50 cursor-pointer rounded-md p-1">
                        <MoreVertical className="h-6 w-6" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-secondary text-muted"
                    >
                      <DropdownMenuItem
                        onClick={() =>
                          handleDeleteNotification(notification.id)
                        }
                        className="focus:bg-destructive/20 focus:text-muted/80 cursor-pointer text-sm"
                      >
                        <Trash className="text-muted h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Notification;
