import { Suspense } from "react";
import BackButton from "./(ui)/back-button";
import ProfileInfo from "./(ui)/profile-info";
import { ProfileInfoSkeleton } from "./(ui)/skeletons/profile-info-skeleton";

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileInfoSkeleton />}>
      <div className="container mx-auto py-10">
        <BackButton />
        <ProfileInfo />
      </div>
    </Suspense>
  );
}
