export type TMessageType = "text" | "image" | "audio";

export interface IMessage {
  id: string;
  user_id: string;
  type: TMessageType;
  content: string;
  timestamp: string;
}
