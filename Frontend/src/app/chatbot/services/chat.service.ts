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
  getFeedback() {
    return this.feedbackSubject.asObservable();
  }
  addFeedback(feedback: ChatFeedback) {
    this.feedback.push(feedback);
    this.feedbackSubject.next(this.feedback);
  }

  getFeedbackStats() {
    const total = this.feedback.length;
    const likes = this.feedback.filter(f => f.liked).length;
    const dislikes = total - likes;
    
    return {
      total,
      likes,
      dislikes,
      likePercentage: total > 0 ? (likes / total) * 100 : 0
    };
  }
}
