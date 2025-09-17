import * as customForm from "@/components/ui/form";

import { Input } from "@/components/ui/input";

interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  name: string;
  label: string;
  placeholder: string;
  description?: string;
  defaultValue?: string;
}

export const TextInput = ({
  form,
  name,
  label,
  placeholder,
  description,
  defaultValue,
}: IProps) => {
  return (
    <customForm.FormField
      control={form.control}
      name={name}
      defaultValue={defaultValue}
      render={({ field }) => (
        <customForm.FormItem className="text-muted text-xs">
          <customForm.FormLabel className="text-xs font-semibold">
            {label}
          </customForm.FormLabel>
          <customForm.FormControl>
            <Input
              className="text-xs placeholder:text-xs"
              placeholder={placeholder}
              defaultValue={defaultValue}
              {...field}
            />
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
