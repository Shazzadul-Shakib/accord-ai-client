import { apiService } from "@/lib/apiService";

const chatList = async () => {
  return apiService.get("/room");
}

const chatMessages = async ({roomId}:{roomId:string}) => {
  return apiService.get(`/room/${roomId}/messages`);
};

export const chatApi = {
  chatList,
  chatMessages,
};
