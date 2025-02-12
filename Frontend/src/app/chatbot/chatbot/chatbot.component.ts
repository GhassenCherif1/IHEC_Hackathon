import { Component } from "@angular/core";
import { ChatService } from "../services/chat.service";
import { SpeechService } from "../services/speech.service";
import { TextToSpeechService } from "../services/text-to-speech.service";
import { ChatMessage } from "../interfaces/chat-message";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ChatFeedback } from "../../dashboard/interfaces/chatfeedback";
import { ChatFeedbackCreate } from "../../dashboard/interfaces/chatfeedbackcreate";

@Component({
  selector: "app-chatbot",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./chatbot.component.html",
  styleUrl: "./chatbot.component.css",
})
export class ChatbotComponent {
  messages: ChatMessage[] = [
    {
      id: "system",
      role: "system",
      content:
        "You are a virtual assistant designed to guide new students at IHEC Carthage. You should provide information about academic programs, enrollment procedures, student events, campus services, and other student-related queries. The questions can be asked in either French or English, and you should respond appropriately in the language of the question.",
    },
    {id:"Hello", content: "Hello! How can I help you today?", role: "assistant" },
  ];
  userInput = "";
  isChatVisible = false;

  constructor(
    private chatService: ChatService,
    private speechService: SpeechService,
    private ttsService: TextToSpeechService
  ) {}

  startVoice(): void {
    this.speechService.startListening((transcript: string) => {
      this.userInput = transcript;
      console.log("Recognized:", transcript);
    });
  }

  stopVoice(): void {
    this.speechService.stopListening();
  }

  toggleVoice() {
    if (this.speechService.isListening) {
      this.speechService.stopListening();
    } else {
      this.speechService.startListening((transcript: string) => {
        this.userInput = transcript;
        console.log("Recognized:", transcript);
      });
    }
  }

  toggleChat() {
    this.isChatVisible = !this.isChatVisible;
  }

  sendMessage() {
    if (this.userInput.trim() === "") return;

    // Add user message
    this.messages.push({
      id :Date.now().toString(),
      content: this.userInput,
      role: "user",
    });
    console.log(this.messages);
    // Get and add bot response
    this.chatService
      .getBotResponse(this.messages)
      .subscribe({
        next: (response) => {
          this.messages.push({
            id: Date.now().toString(),
            content: response.message.content,
            role: response.message.role,
          });
        },
      });

    // Clear input
    this.userInput = "";
  }
  readText(textToRead: string): void {
    if (textToRead.trim()) {
      this.ttsService.speak(textToRead);
    } else {
      alert("Please enter some text to read.");
    }
  }

  stopReading(): void {
    this.ttsService.stop();
  }
  provideFeedback(message: ChatMessage, liked: boolean) {
    if (message.feedback !== undefined) return; // Prevent multiple feedback

    message.feedback = liked;
    
    // Find the user message that preceded this bot response
    const messageIndex = this.messages.findIndex(m => m.id === message.id);
    const userMessage = messageIndex > 0 ? this.messages[messageIndex - 1].content : '';
    
    const feedbackData:ChatFeedbackCreate={
      id: message.id,
      message: userMessage,
      response: message.content,
      liked: liked
  };
    this.chatService.addFeedback(feedbackData).subscribe(response => {
      console.log("Feedback saved:", response);
  }, error => {
      console.error("Error saving feedback:", error);
  });
  }
  
}
