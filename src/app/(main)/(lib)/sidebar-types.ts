export interface IChat {
  roomId: string;
  topicTitle: string;
  lastMessage: string;
  lastMessageTime: string;
}
export interface INotification {
  id: string;
  topicId: string;
  title: string;
  hasResponse: boolean;
  description: string;
  time: string;
}
