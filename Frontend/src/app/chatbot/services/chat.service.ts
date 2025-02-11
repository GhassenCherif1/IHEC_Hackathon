import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ResquestDto } from '../dto/request.dto';
import { ChatMessage } from '../interfaces/chat-message';
import { ChatFeedback } from '../../dashboard/chatfeedback';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);
  constructor() {}
  private feedback: ChatFeedback[] = [];
  private feedbackSubject = new BehaviorSubject<ChatFeedback[]>([]);

  getBotResponse(request: ResquestDto[]): Observable<any> {
    console.log(request)
    return this.http.post("http://localhost:8000/chat", request);
  }
  getFeedback(): Observable<ChatFeedback[]> {
    return this.http.get<ChatFeedback[]>("http://localhost:8000/feedback");
  }
  addFeedback(feedback: ChatFeedback): Observable<ChatFeedback> {
    return this.http.post<ChatFeedback>("http://localhost:8000/feedback", feedback);
  }
  getFeedbackStats(): Observable<{ total: number; likes: number; dislikes: number; likePercentage: number }> {
    return this.http.get<{ total: number; likes: number; dislikes: number; likePercentage: number }>("http://localhost:8000/feedback/stats");
  }
}
