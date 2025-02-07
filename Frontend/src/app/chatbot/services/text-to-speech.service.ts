import { Injectable } from '@angular/core';
import { franc } from 'franc-min';

@Injectable({
  providedIn: 'root',
})
export class TextToSpeechService {
  private synth = window.speechSynthesis;

  constructor() {
    if (!this.synth) {
      console.error('SpeechSynthesis API not supported in this browser.');
    }
  }

  detectLanguage(text: string): string {
    const langCode = franc(text, { minLength: 3 }); // Detect the language
    if (langCode === 'fra') {
      return 'fr-FR'; // French
    } else if (langCode === 'eng') {
      return 'en-US'; // English
    } else {
      return 'en-US'; // Default to English if unknown
    }
  }

  speak(text: string): void {
    const detectedLang = this.detectLanguage(text);
    if (this.synth) {
      this.synth.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = detectedLang; // Set the detected language
      this.synth.speak(utterance);
    }
  }

  stop(): void {
    if (this.synth) {
      this.synth.cancel(); // Stop any ongoing speech
    }
  }
}
