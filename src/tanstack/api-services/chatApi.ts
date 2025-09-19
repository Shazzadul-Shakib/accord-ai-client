import { apiService } from "@/lib/apiService";

const chatList = async () => {
  return apiService.get("/room");
};

const chatMessages = async ({ roomId }: { roomId: string }) => {
  return apiService.get(`/room/${roomId}/messages`);
};

const addTopicRequest = async (data: object) => {
  return apiService.post(`/topic/create-topic-request`, data);
};

export const chatApi = {
  chatList,
  chatMessages,
  addTopicRequest,
};
