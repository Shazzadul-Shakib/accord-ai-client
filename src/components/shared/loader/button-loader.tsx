import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonLoaderProps {
  text?: string;
  className?: string;
  loaderSize?: number;
}

export function ButtonLoader({
  text = "Loading",
  className,
  loaderSize = 16,
}: ButtonLoaderProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {text}
      <Loader className="animate-spin" size={loaderSize} />
    </div>
  );
}
