import { apiService } from "@/lib/apiService";

const chatList = async () => {
  return apiService.get("/room");
};

export const chatApi = {
  chatList,
};
