"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface User {
  _id: string;
  name: string;
  image: string;
  isOnline: boolean;
}

interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  name: string;
  label: string;
  placeholder: string;
  defaultValue?: string[];
  users?: User[];
  loading?: boolean;
  onlineUsers: string[];
}

export const SelectUsers = ({
  form,
  name,
  label,
  placeholder,
  defaultValue,
  users = [],
  loading = false,
  onlineUsers,
}: IProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  users = users
    .map((user) => ({
      ...user,
      isOnline: onlineUsers.includes(user._id as never),
    }))
    .sort((a, b) => {
      if (a.isOnline === b.isOnline) return 0;
      return a.isOnline ? -1 : 1;
    });

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const selectedValues = field.value || defaultValue || [];
        const selectedUsers = users.filter((user) =>
          selectedValues.includes(user._id),
        );

        const filteredUsers = users.filter((user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );

        const handleSelect = (userId: string) => {
          const newValue = selectedValues.includes(userId)
            ? selectedValues.filter((id: string) => id !== userId)
            : [...selectedValues, userId];
          field.onChange(newValue);
        };

        const handleRemove = (userId: string) => {
          const newValue = selectedValues.filter((id: string) => id !== userId);
          field.onChange(newValue);
        };

        return (
          <FormItem className="w-full ">
            <FormLabel className="font-semibold">{label}</FormLabel>
            <div className="w-full space-y-2">
              <FormControl>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "min-h-[40px] w-full justify-between",
                    selectedValues.length === 0 &&
                      "text-muted-foreground hover:text-muted hover:bg-border",
                  )}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {selectedValues.length === 0
                    ? loading
                      ? "Loading users..."
                      : placeholder
                    : `${selectedValues.length} user${
                        selectedValues.length === 1 ? "" : "s"
                      } selected`}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>

              {isOpen && (
                <div className="border-input bg-background rounded-md border">
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 focus-visible:ring-0"
                  />
                  <ScrollArea className="h-[240px]">
                    {loading ? (
                      <div className="p-4 text-center">Loading users...</div>
                    ) : filteredUsers.length === 0 ? (
                      <div className="p-4 text-center">No users found.</div>
                    ) : (
                      <div className="p-2">
                        {filteredUsers.map((user) => (
                          <div
                            key={user._id}
                            className="hover:bg-border flex cursor-pointer items-center justify-between rounded-md p-2"
                            onClick={() => handleSelect(user._id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage
                                    src={user.image || "/user.jpg"}
                                    alt={user.name}
                                  />
                                  <AvatarFallback className="text-sm">
                                    {user.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <span
                                  className={`absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white ${user.isOnline ? "bg-green-500" : "bg-gray-400"}`}
                                ></span>
                              </div>
                              <span className="text-sm font-medium">
                                {user.name}
                              </span>
                            </div>
                            <Check
                              className={cn(
                                "h-4 w-4",
                                selectedValues.includes(user._id)
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              )}

              {/* Selected users badges */}
              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedUsers.map((user) => (
                    <Badge
                      key={user._id}
                      variant="secondary"
                      className="text-mute flex items-center gap-1 pr-1 pl-2"
                    >
                      <Avatar className="h-4 w-4">
                        <AvatarImage
                          src={user.image || "/user.jpg"}
                          alt={user.name}
                        />
                        <AvatarFallback className="text-xs">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{user.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-mute h-4 w-4 p-0 text-red-500"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemove(user._id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
