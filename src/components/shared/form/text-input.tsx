import * as customForm from "@/components/ui/form";

import { Input } from "@/components/ui/input";

interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  name: string;
  label: string;
  placeholder: string;
  description?: string;
}

export const TextInput = ({
  form,
  name,
  label,
  placeholder,
  description,
}: IProps) => {
  return (
    <customForm.FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <customForm.FormItem>
          <customForm.FormLabel className="font-semibold">
            {label}
          </customForm.FormLabel>
          <customForm.FormControl>
            <Input placeholder={placeholder} {...field} />
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
