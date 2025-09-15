import { TextInput } from "@/components/shared/form/text-input";
import { Button } from "@/components/ui/button";
import * as customForm from "@/components/ui/form";
import { useAddTopicRequest } from "../../(lib)/useAddTopicRequest";

const AddTopicRequest: React.FC = () => {
  const { form, onRequest } = useAddTopicRequest();
  return (
    <customForm.Form {...form}>
      <form className="flex flex-col gap-3" onSubmit={onRequest}>
        <TextInput
          form={form}
          name="topic"
          label="Topic"
          placeholder="@topic's name here..."
        />

        <Button type="submit" className="mt-2 w-full cursor-pointer">
          {/* {isLoading ? "Logging in..." : "Login"} */}
          Save
        </Button>
      </form>
    </customForm.Form>
  );
};

export default AddTopicRequest;
