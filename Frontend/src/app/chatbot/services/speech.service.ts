import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  private recognition: any;
  public isListening = false;

  constructor() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US'; // Set language
      this.recognition.continuous = false; // Stops listening after a single result
      this.recognition.interimResults = false; // Don't show partial matches
    } else {
      console.error('SpeechRecognition not supported in this browser.');
    }
  }

  startListening(callback: (result: string) => void): void {
    if (this.recognition && !this.isListening) {
      this.recognition.start();
      this.isListening = true;

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        callback(transcript);
      };

      this.recognition.onerror = (error: any) => {
        console.error('Speech recognition error:', error);
      };
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}