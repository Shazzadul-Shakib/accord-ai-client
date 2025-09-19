"use client";
import { FC } from "react";
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
  const { isNotificationLoading, notifications } = useSidebar();

  return (
    <div className="relative mt-2">
      <DropdownMenu>
        <DropdownMenuTrigger className="relative">
          <Bell className="mr-2 h-4 w-4 cursor-pointer sm:h-6 sm:w-6" />
          {/* Notification badge */}
          <div className="bg-primary absolute -top-1.5 right-1 flex h-4 w-4 items-center justify-center rounded-full">
            <span className="text-primary-foreground text-[9px]">
              {isNotificationLoading ? (
                "..."
              ) : (
                notifications.data.length
              )}
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
          ) : (
            notifications?.data?.map((notification: INotification) => (
              <div key={notification.id}>
                <customDialog.Dialog>
                  <customDialog.DialogTrigger asChild>
                    <DropdownMenuItem
                      className="hover:bg-border focus:bg-border cursor-pointer rounded-md p-2"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <div className="flex w-full items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <div className="text-muted text-xs">
                            {notification.description}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {notification.time}
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger className="focus:outline-none">
                            <div className="hover:bg-border rounded-md p-1 cursor-pointer">
                              <MoreVertical className="h-6 w-6" />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-secondary text-muted"
                          >
                            <DropdownMenuItem className="focus:bg-destructive/20 focus:text-muted/80 cursor-pointer text-sm">
                              <Trash className="text-muted h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </DropdownMenuItem>
                  </customDialog.DialogTrigger>
                  <customDialog.DialogContent>
                    <customDialog.DialogHeader>
                      <customDialog.DialogTitle>
                        {notification.title}
                      </customDialog.DialogTitle>
                      <customDialog.DialogDescription>
                        {notification.description}
                      </customDialog.DialogDescription>
                    </customDialog.DialogHeader>
                    <div className="flex justify-end gap-2">
                      <button className="bg-destructive text-destructive-foreground rounded-md px-4 py-2 text-sm">
                        Reject
                      </button>
                      <button className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm">
                        Accept
                      </button>
                    </div>
                  </customDialog.DialogContent>
                </customDialog.Dialog>
              </div>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Notification;
