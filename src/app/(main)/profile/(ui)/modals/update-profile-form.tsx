"use client";
import { TextInput } from "@/components/shared/form/text-input";
import * as customForm from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Image from "next/image";
import { useProfile } from "../../(lib)/useProfile";

const UpdateProfile: React.FC = () => {
  const { form, onUpdate } = useProfile();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <customForm.Form {...form}>
      <form className="flex flex-col gap-3" onSubmit={onUpdate}>
        <TextInput
          form={form}
          name="name"
          label="Name"
          placeholder="@john doe"
        />

        <customForm.FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <customForm.FormItem>
              <customForm.FormLabel>Profile Image</customForm.FormLabel>
              <customForm.FormControl>
                <div className="flex flex-col items-center gap-4">
                  <label
                    htmlFor="profile-image"
                    className="group relative h-32 w-32 cursor-pointer"
                  >
                    {imagePreview ? (
                      <>
                        <Image
                          src={imagePreview}
                          alt="Profile Preview"
                          fill
                          className="rounded-full border-2 border-gray-200 object-cover"
                        />
                        <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-full bg-black opacity-0 transition-opacity group-hover:opacity-100">
                          <span className="text-sm text-white">
                            Change Image
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50">
                        <span className="px-2 text-center text-sm text-gray-500">
                          Click to upload profile picture
                        </span>
                      </div>
                    )}
                    <Input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        field.onChange(e.target.files?.[0]);
                        handleImageChange(e);
                      }}
                    />
                  </label>
                  <p className="text-sm text-gray-500">
                    Recommended: Square image, at least 400x400px
                  </p>
                </div>
              </customForm.FormControl>
              <customForm.FormMessage className="text-center" />
            </customForm.FormItem>
          )}
        />
      </form>
    </customForm.Form>
  );
};

export default UpdateProfile;
