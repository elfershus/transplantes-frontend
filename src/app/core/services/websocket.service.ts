// src/app/core/services/websocket.service.ts
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { io, Socket } from 'socket.io-client';

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: Socket | null = null;
  private notifications = new BehaviorSubject<Notification[]>([]);
  private unreadCount = new BehaviorSubject<number>(0);
  
  public notifications$ = this.notifications.asObservable();
  public unreadCount$ = this.unreadCount.asObservable();
  
  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.connect();
      } else {
        this.disconnect();
      }
    });
  }
  
  private connect(): void {
    const token = this.authService.getToken();
    
    if (!token) return;
    
    this.socket = io(environment.apiUrl, {
      auth: {
        token: `Bearer ${token}`
      }
    });
    
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.loadNotifications();
    });
    
    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });
    
    this.socket.on('notification', (notification: Notification) => {
      this.addNotification(notification);
    });
  }
  
  private disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.notifications.next([]);
      this.unreadCount.next(0);
    }
  }
  
  private loadNotifications(): void {
    // Load notifications from the API
    fetch(`${environment.apiUrl}/notifications`, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    })
    .then(response => response.json())
    .then(data => {
      this.notifications.next(data);
      this.updateUnreadCount();
    })
    .catch(error => {
      console.error('Error loading notifications:', error);
    });
  }
  
  private addNotification(notification: Notification): void {
    const current = this.notifications.value;
    this.notifications.next([notification, ...current]);
    this.updateUnreadCount();
  }
  
  private updateUnreadCount(): void {
    const count = this.notifications.value.filter(n => !n.read).length;
    this.unreadCount.next(count);
  }
  
  markAsRead(id: number): void {
    if (!this.socket) return;
    
    fetch(`${environment.apiUrl}/notifications/${id}/read`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    })
    .then(() => {
      const current = this.notifications.value;
      const updated = current.map(n => {
        if (n.id === id) {
          return { ...n, read: true };
        }
        return n;
      });
      this.notifications.next(updated);
      this.updateUnreadCount();
    })
    .catch(error => {
      console.error('Error marking notification as read:', error);
    });
  }
  
  markAllAsRead(): void {
    if (!this.socket) return;
    
    fetch(`${environment.apiUrl}/notifications/read-all`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    })
    .then(() => {
      const current = this.notifications.value;
      const updated = current.map(n => ({ ...n, read: true }));
      this.notifications.next(updated);
      this.updateUnreadCount();
    })
    .catch(error => {
      console.error('Error marking all notifications as read:', error);
    });
  }
}