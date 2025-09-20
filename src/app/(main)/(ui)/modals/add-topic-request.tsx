"use client";

import { TextInput } from "@/components/shared/form/text-input";
import { Button } from "@/components/ui/button";
import * as customForm from "@/components/ui/form";
import { useAddTopicRequest } from "../../(lib)/useAddTopicRequest";
import { SelectUsers } from "@/components/shared/form/select-category";
import { useSidebar } from "../../(lib)/useSidebar";
import { ButtonLoader } from "@/components/shared/loader/button-loader";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";

interface OptionProps {
  onSuccess?: () => void;
}

const AddTopicRequest: React.FC<OptionProps> = ({ onSuccess }) => {
  const { isAllUsersLoading, allUsers } = useSidebar();
  const { onlineUsers } = useOnlineUsers();
  
  const { form, onRequest, isAddTopicRequestLoading } = useAddTopicRequest({
    onSuccess,
  });
  const users = allUsers.data;
  return (
    <customForm.Form {...form}>
      <form className="flex flex-col gap-3" onSubmit={onRequest}>
        <TextInput
          form={form}
          name="topic"
          label="Topic"
          placeholder="@topic's name here..."
        />
        <SelectUsers
          form={form}
          name="members"
          label="Members"
          placeholder="Select members"
          users={users}
          loading={isAllUsersLoading}
          onlineUsers={onlineUsers}
        />

        <Button type="submit" className="mt-2 w-full cursor-pointer">
          {isAddTopicRequestLoading ? (
            <ButtonLoader text="Creating" />
          ) : (
            "Create"
          )}
        </Button>
      </form>
    </customForm.Form>
  );
};

export default AddTopicRequest;
