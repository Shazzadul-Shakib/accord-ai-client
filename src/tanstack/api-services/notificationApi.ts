import { apiService } from "@/lib/apiService";

const getNotifications = async () => {
  return apiService.get("/notification/user-notifications");
};

const notificationResponse = async ({
  topicRequestId,
  res,
}: {
  topicRequestId: string;
  res: object;
}) => {
  return apiService.patch(
    `/topic/${topicRequestId}/update-topic-request-response`,
    res,
  );
};

const deleteNotification = async (notificationId:string) => {
  return apiService.delete(
    `/notification/${notificationId}`,
  );
};

export const notificationApi = {
  getNotifications,
  notificationResponse,
  deleteNotification,
};
