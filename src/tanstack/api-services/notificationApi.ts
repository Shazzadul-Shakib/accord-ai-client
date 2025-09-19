import { apiService } from "@/lib/apiService";

const getNotifications = async () => {
  return apiService.get("/notification/user-notifications");
};

export const notificationApi = {
  getNotifications,
};
