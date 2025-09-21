import { apiService } from "@/lib/apiService";

const chatList = async () => {
  return apiService.get("/room");
};

const chatMessages = async ({
  roomId,
  cursor,
}: {
  roomId: string;
  cursor?: string;
}) => {
  return apiService.get(`/room/${roomId}/messages`, {
    cursor,
  });
};

const addTopicRequest = async (data: object) => {
  return apiService.post(`/topic/create-topic-request`, data);
};

const deleteMessage = async ({
  roomId,
  messageId,
}: {
  roomId: string;
  messageId: string;
}) => {
  return apiService.delete(`/message/${roomId}/${messageId}`);
};

const getSummary = async ({ roomId }: { roomId: string }) => {
  return apiService.get(`/room/${roomId}/summary`);
};

export const chatApi = {
  chatList,
  chatMessages,
  addTopicRequest,
  deleteMessage,
  getSummary,
};
