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

const ProfileInfo: React.FC = () => {
  const {
    isLoggedUserLoading,
    loggedUser,
    IsLoggedUserError,
    loggedUserError,
  } = useProfile();
  

  if(isLoggedUserLoading){
    return <>Loading...</>
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
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.image ?? "/user.jpg"} alt={user.name} />
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

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full cursor-pointer">Update Profile</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click &apos;save&apos; when
                you&apos;re done.
              </DialogDescription>
            </DialogHeader>

            <UpdateProfile />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ProfileInfo;
