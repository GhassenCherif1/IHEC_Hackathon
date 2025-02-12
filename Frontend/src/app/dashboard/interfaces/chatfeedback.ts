export interface ChatFeedback {
    messageId: string;
    message: string;
    response: string;
    liked: boolean;
    timestamp: Date;
  }