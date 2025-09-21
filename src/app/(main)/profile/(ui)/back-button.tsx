import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BackButton() {
  return (
    <Link href="/" className="inline-block">
      <Button
        variant="ghost"
        className="hover:bg-border hover:text-muted mb-4 ml-4 cursor-pointer"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
    </Link>
  );
}
