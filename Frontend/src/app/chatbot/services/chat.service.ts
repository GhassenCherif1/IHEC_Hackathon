import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResquestDto } from '../dto/request.dto';
import { ChatMessage } from '../interfaces/chat-message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);
  constructor() {}

  getBotResponse(request: ChatMessage[]): Observable<any> {
    
    return this.http.post("http://localhost:8000/chat", request);
  }
}