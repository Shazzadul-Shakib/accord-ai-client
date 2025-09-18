"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UpdateProfile from "./modals/update-profile-form";
import { useProfile } from "../(lib)/useProfile";
import { useState } from "react";
import { ProfileInfoSkeleton } from "./skeletons/profile-info-skeleton";

const ProfileInfo: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { isLoggedUserLoading, loggedUser, isUpdating } = useProfile();

  if (isLoggedUserLoading || isUpdating) {
    return <ProfileInfoSkeleton />;
  }
  const user = loggedUser.data;
  return (
    <Card className="bg-secondary text-muted mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="text-primary text-xl font-semibold">
          Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="border-primary h-28 w-28 border-4">
            <AvatarImage
              src={user.image || "/user.jpg"}
              alt={user.name}
              className="object-cover"
            />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-primary text-sm font-medium">Name</label>
            <p className="text-sm">{user.name}</p>
          </div>

          <div className="space-y-2">
            <label className="text-primary text-sm font-medium">Email</label>
            <p className="text-sm">{user.email}</p>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full cursor-pointer">Update Profile</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here
              </DialogDescription>
            </DialogHeader>

            {/* ✅ pass onSuccess to close dialog */}
            <UpdateProfile onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ProfileInfo;
