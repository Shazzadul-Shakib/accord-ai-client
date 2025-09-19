export interface IMessage {
  createdAt: string;
  roomId: string;
  sender: {
    _id: string;
    name: string;
  };
  text: string;
  updatedAt: string;
  _id: string;
}

export interface MessageBoxSkeletonProps {
  className?: string;
  position?: "left" | "right";
}