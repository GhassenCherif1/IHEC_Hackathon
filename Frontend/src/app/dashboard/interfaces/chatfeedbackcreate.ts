export interface ChatFeedbackCreate {
    id: string;
    message: string;
    response: string;
    liked: boolean;
  }