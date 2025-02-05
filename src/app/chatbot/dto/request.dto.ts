import { ChatMessage } from "../interfaces/chat-message";

export interface ResquestDto {
    model: string;
    messages : ChatMessage[];
    stream: boolean;
}
  