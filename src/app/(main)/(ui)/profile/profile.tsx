"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLogout } from "../../(lib)/profile/useLogout";
import { useProfile } from "../../profile/(lib)/useProfile";

const Profile: React.FC = () => {
  const { logout, isLoading } = useLogout();
  const { isLoggedUserLoading, loggedUser } = useProfile();


  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          {isLoggedUserLoading ? (
            <div className="h-[36px] w-[36px] animate-pulse rounded-full bg-muted" />
          ) : (
            <Image
              src={loggedUser?.data?.image || "/user.jpg"}
              alt={loggedUser?.data?.name || "user profile"}
              height={33}
              width={33}
              className="border-primary h-[36px] w-[36px] cursor-pointer rounded-full border-[3px] object-cover"
            />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-secondary text-muted/90">
          <Link href="/profile">
            <DropdownMenuItem className="hover:bg-border focus:bg-border focus:text-muted/80 cursor-pointer text-xs sm:text-sm">
              <User className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Profile
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            onClick={() => logout()}
            className="hover:bg-destructive/20 focus:bg-destructive/20 focus:text-muted/80 cursor-pointer text-xs sm:text-sm"
            disabled={isLoading}
          >
            <LogOut className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Profile;
