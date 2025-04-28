// 
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { WebsocketService, Notification } from '../../../core/services/websocket.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatListModule
  ],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  unreadCount = 0;
  
  constructor(private websocketService: WebsocketService) {}
  
  ngOnInit(): void {
    this.websocketService.notifications$.subscribe(notifications => {
      this.notifications = notifications.slice(0, 10); // Show only the 10 most recent
    });
    
    this.websocketService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
    });
  }
  
  markAsRead(notification: Notification, event: Event): void {
    event.stopPropagation();
    if (!notification.read) {
      this.websocketService.markAsRead(notification.id);
    }
  }
  
  markAllAsRead(event: Event): void {
    event.stopPropagation();
    this.websocketService.markAllAsRead();
  }
  
  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    
    return new Date(date).toLocaleDateString();
  }
  
  getNotificationIcon(type: string): string {
    switch (type) {
      case 'ORGAN_AVAILABLE': return 'favorite';
      case 'COMPATIBILITY_FOUND': return 'compare_arrows';
      case 'TRANSPORT_STATUS': return 'local_shipping';
      case 'URGENT_RECEIVER': return 'priority_high';
      default: return 'notifications';
    }
  }
  
  getNotificationColor(type: string): string {
    switch (type) {
      case 'ORGAN_AVAILABLE': return 'primary';
      case 'COMPATIBILITY_FOUND': return 'accent';
      case 'TRANSPORT_STATUS': return 'warn';
      case 'URGENT_RECEIVER': return 'warn';
      default: return '';
    }
  }
}