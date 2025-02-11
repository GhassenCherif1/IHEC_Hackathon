import { Component } from '@angular/core';
import { ChatbotComponent } from './chatbot/chatbot/chatbot.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from "./navbar/navbar.component";
import { HomeComponent } from "./home/home.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent,RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

}
