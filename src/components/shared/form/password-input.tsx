import * as customForm from "@/components/ui/form";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  name: string;
  label: string;
  placeholder: string;
  description?: string;
}

export const PasswordInput = ({ form, name, label, description }: IProps) => {
  const [isShown, setIsShown] = useState(false);

  const onToggle = () => {
    setIsShown((prev) => !prev);
  };

  return (
    <customForm.FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <customForm.FormItem className="text-muted text-xs">
          <customForm.FormLabel className="text-xs font-semibold">
            {label}
          </customForm.FormLabel>
          <customForm.FormControl>
            <div className="relative">
              <Input
                className="text-xs placeholder:text-xs"
                placeholder={"*******"}
                type={isShown ? "text" : "password"}
                {...field}
              />
              <div
                onClick={onToggle}
                className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
              >
                {isShown ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </customForm.FormControl>
          {/* show error message */}
          <customForm.FormMessage />

          {/* if any description is provided */}
          {description && (
            <customForm.FormDescription>
              {description}
            </customForm.FormDescription>
          )}
        </customForm.FormItem>
      )}
    />
  );
};
