import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BackButton from "./(ui)/back-button";
import UpdateProfile from "./(ui)/modals/update-profile-form";

export default function ProfilePage() {
  // Placeholder user data - replace with actual data fetching
  const user = {
    name: "John Doe",
    email: "john@example.com",
    image: "/user.jpg",
  };

  return (
    <div className="container mx-auto py-10">
      <BackButton />

      <Card className="bg-secondary text-muted mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="text-primary text-xl font-semibold">
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.image} alt={user.name} />
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
    </div>
  );
}
