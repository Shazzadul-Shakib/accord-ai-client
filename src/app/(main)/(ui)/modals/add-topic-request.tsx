import { TextInput } from "@/components/shared/form/text-input";
import { Button } from "@/components/ui/button";
import * as customForm from "@/components/ui/form";
import { useAddTopicRequest } from "../../(lib)/useAddTopicRequest";
import { SelectUsers } from "@/components/shared/form/select-category";

const users = [
  {
    id: "1",
    name: "shakib",
    image: "/user.jpg",
  },
  {
    id: "2",
    name: "Afreen",
    image: "/user.jpg",
  },
  {
    id: "3",
    name: "Astro",
    image: "/user.jpg",
  },
  {
    id: "4",
    name: "Shazzad",
    image: "/user.jpg",
  },
  {
    id: "5",
    name: "Farzana",
    image: "/user.jpg",
  },
  {
    id: "6",
    name: "Farzana",
    image: "/user.jpg",
  },
  {
    id: "7",
    name: "Farzana",
    image: "/user.jpg",
  },
];

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
        <SelectUsers
          form={form}
          name="members"
          label="Members"
          placeholder="Select members"
          users={users}
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
