import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResquestDto } from '../dto/request.dto';
import { ChatFeedback } from '../../dashboard/interfaces/chatfeedback';
import { ChatFeedbackCreate } from '../../dashboard/interfaces/chatfeedbackcreate';
import { API } from '../../../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);
  constructor() {}

  getBotResponse(request: ResquestDto[]): Observable<any> {
    console.log(request)
    return this.http.post(API.chat, request);
  }
  getFeedback(): Observable<ChatFeedback[]> {
    return this.http.get<ChatFeedback[]>(API.feedback);
  }
  addFeedback(feedback:ChatFeedbackCreate): Observable<ChatFeedback> {
    return this.http.post<ChatFeedback>(API.feedback, feedback);
  }
  getFeedbackStats(): Observable<{ total: number; likes: number; dislikes: number; likePercentage: number }> {
    return this.http.get<{ total: number; likes: number; dislikes: number; likePercentage: number }>(API.feedbackStats);
  }
}
