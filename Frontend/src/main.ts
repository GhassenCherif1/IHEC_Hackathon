import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ChatService } from "./app/chatbot/services/chat.service";
import { SpeechService } from "./app/chatbot/services/speech.service";
import { TextToSpeechService } from "./app/chatbot/services/text-to-speech.service";
import { provideHttpClient } from "@angular/common/http";
import { AppComponent } from "./app/app.component";
import { provideRouter } from "@angular/router";
import { routes } from "./app/app.routes";

bootstrapApplication(AppComponent, {
  providers: [ChatService,provideHttpClient(),provideRouter(routes),SpeechService, TextToSpeechService],
});
