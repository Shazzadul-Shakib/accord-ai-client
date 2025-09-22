import { TErrorResponse } from "@/app/(auth)/login/(lib)/loginSchema";
import { useSafeSearchParams } from "@/hooks/useSearchParams";
import { authApi } from "@/tanstack/api-services/authApi";
import { chatApi } from "@/tanstack/api-services/chatApi";
import { notificationApi } from "@/tanstack/api-services/notificationApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useSidebar = (options?: { onSuccess?: () => void }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSafeSearchParams();

  const selectedChatId = searchParams?.get("chat");
  // get logged users ChatLists
  const {
    isPending: isChatListLoading,
    data: chatList,
    isError: IsChatListError,
    error: chatListError,
  } = useQuery({
    queryKey: ["chat"],
    queryFn: chatApi.chatList,
    refetchInterval: 3000,
  });

  // get all users
  const { isPending: isAllUsersLoading, data: allUsers } = useQuery({
    queryKey: ["users", "user"],
    queryFn: authApi.allUsers,
  });

  // get all user notifications
  const { isPending: isNotificationLoading, data: notifications } = useQuery({
    queryKey: ["notification"],
    queryFn: notificationApi.getNotifications,
    staleTime: 0, // Consider data stale immediately
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchInterval: 3000,
  });

  const handleChatSelect = (chatId: string) => {
    router.push(`/?chat=${chatId}`);
  };

  // response topic request notification
  const { mutate: responseRequest, isPending: isResponseRequestLoading } =
    useMutation({
      mutationFn: notificationApi.notificationResponse,
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: ["notification"],
          refetchType: "active",
        });
        options?.onSuccess?.();
      },
      onError: (error: TErrorResponse) => {
        toast.error(error.data.message);
      },
    });

  const handleNotificationRequest = ({
    topicRequestId,
    res,
  }: {
    topicRequestId: string;
    res: object;
  }) => {
    responseRequest({ topicRequestId, res });
  };

  // delete notification
  const { mutate: deleteNotification } = useMutation({
    mutationFn: notificationApi.deleteNotification,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["notification"],
        refetchType: "active",
      });
    },
    onError: (error: TErrorResponse) => {
      toast.error(error.data.message);
    },
  });

  const handleDeleteNotification = (notificationId: string) => {
    deleteNotification(notificationId);
  };

  return {
    isChatListLoading,
    chatList,
    IsChatListError,
    chatListError,
    handleChatSelect,
    selectedChatId,
    allUsers,
    isAllUsersLoading,
    isNotificationLoading,
    notifications,
    handleNotificationRequest,
    isResponseRequestLoading,
    handleDeleteNotification,
  };
};
