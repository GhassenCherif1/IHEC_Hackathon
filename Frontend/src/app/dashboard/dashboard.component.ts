import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';;
import Chart from 'chart.js/auto';
import { ChatService } from '../chatbot/services/chat.service';
import { ChatFeedback } from './interfaces/chatfeedback';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css",
})
export class DashboardComponent implements AfterViewInit {
  @ViewChild('pieChart') private pieChartRef!: ElementRef;
  @ViewChild('lineChart') private lineChartRef!: ElementRef;
  
  stats = {
    total: 0,
    likes: 0,
    dislikes: 0,
    likePercentage: 0
  };
  feedbackList: ChatFeedback[] = [];
  private pieChart: Chart | null = null;
  private lineChart: Chart | null = null;

  constructor(private chatService: ChatService) {
    this.chatService.getFeedback().subscribe(feedback => {
      this.feedbackList = feedback.slice().reverse();
      this.chatService.getFeedbackStats().subscribe(stats => {
        this.stats = stats;
        
        // Ensure pie chart initializes after data is available
        if (this.pieChartRef && this.pieChartRef.nativeElement) {
          if (!this.pieChart) {
            this.initializeCharts();
          } else {
            this.updateCharts();
          }
        }
      });
      this.updateCharts();
    });
  }

  ngAfterViewInit() {
    this.initializeCharts();
  }

  private initializeCharts() {
    // Initialize Pie Chart
    this.pieChart = new Chart(this.pieChartRef.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Likes', 'Dislikes'],
        datasets: [{
          data: [this.stats.likes, this.stats.dislikes],
          backgroundColor: ['#28a745', '#dc3545'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Feedback Distribution'
          }
        }
      }
    });

    // Initialize Line Chart
    this.lineChart = new Chart(this.lineChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: this.getLast7Days(),
        datasets: [{
          label: 'Daily Feedback',
          data: this.getDailyFeedbackCounts(),
          borderColor: '#0052cc',
          tension: 0.1,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Feedback Trend (Last 7 Days)'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  private updateCharts() {
    if (this.pieChart) {
      this.pieChart.data.datasets[0].data = [this.stats.likes, this.stats.dislikes];
      this.pieChart.update();
    }

    if (this.lineChart) {
      this.lineChart.data.datasets[0].data = this.getDailyFeedbackCounts();
      this.lineChart.update();
    }
  }

  private getLast7Days(): string[] {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    return dates;
  }

  private getDailyFeedbackCounts(): number[] {
    const counts = new Array(7).fill(0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.feedbackList.forEach(feedback => {
      const feedbackDate = new Date(feedback.timestamp);
      feedbackDate.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today.getTime() - feedbackDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff >= 0 && daysDiff < 7) {
        counts[6 - daysDiff]++;
      }
    });

    return counts;
  }
}