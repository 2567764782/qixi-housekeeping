import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface ConnectedUser {
  socketId: string;
  userId: number;
  role: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/realtime'
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers: Map<number, ConnectedUser> = new Map();

  /**
   * 客户端连接时
   */
  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  /**
   * 客户端断开连接时
   */
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);

    // 移除用户连接记录
    for (const [userId, user] of this.connectedUsers.entries()) {
      if (user.socketId === client.id) {
        this.connectedUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  }

  /**
   * 用户登录
   */
  @SubscribeMessage('user:login')
  handleUserLogin(
    @MessageBody() data: { userId: number; role: string },
    @ConnectedSocket() client: Socket
  ) {
    console.log(`User login:`, data);

    // 记录用户连接
    this.connectedUsers.set(data.userId, {
      socketId: client.id,
      userId: data.userId,
      role: data.role
    });

    // 加入用户房间
    client.join(`user-${data.userId}`);

    // 返回成功
    this.server.to(client.id).emit('user:login:success', {
      message: 'Login successful',
      userId: data.userId
    });
  }

  /**
   * 用户登出
   */
  @SubscribeMessage('user:logout')
  handleUserLogout(
    @MessageBody() data: { userId: number },
    @ConnectedSocket() client: Socket
  ) {
    console.log(`User logout:`, data);

    // 移除用户连接记录
    this.connectedUsers.delete(data.userId);

    // 离开用户房间
    client.leave(`user-${data.userId}`);

    // 返回成功
    this.server.to(client.id).emit('user:logout:success', {
      message: 'Logout successful'
    });
  }

  /**
   * 发送订单更新通知
   */
  sendOrderUpdate(orderId: number, orderData: any, recipientUserId?: number) {
    if (recipientUserId) {
      // 发送给特定用户
      this.server.to(`user-${recipientUserId}`).emit('order:update', {
        orderId,
        ...orderData
      });
    } else {
      // 广播给所有连接的用户
      this.server.emit('order:update', {
        orderId,
        ...orderData
      });
    }
  }

  /**
   * 发送新订单通知
   */
  sendNewOrder(orderId: number, orderData: any) {
    // 发送给所有保洁员
    for (const [userId, user] of this.connectedUsers.entries()) {
      if (user.role === 'cleaner') {
        this.server.to(`user-${userId}`).emit('order:new', {
          orderId,
          ...orderData
        });
      }
    }
  }

  /**
   * 发送订单匹配通知
   */
  sendOrderMatch(orderId: number, orderData: any, cleanerId: number) {
    const user = this.connectedUsers.get(cleanerId);
    if (user) {
      this.server.to(`user-${cleanerId}`).emit('order:match', {
        orderId,
        ...orderData
      });
    }
  }

  /**
   * 发送通知消息
   */
  sendNotification(userId: number, notification: any) {
    this.server.to(`user-${userId}`).emit('notification', notification);
  }

  /**
   * 发送系统广播
   */
  broadcast(message: any) {
    this.server.emit('broadcast', message);
  }

  /**
   * 发送保洁员位置更新
   */
  sendCleanerLocationUpdate(cleanerId: number, location: { latitude: number; longitude: number }) {
    this.server.emit('cleaner:location', {
      cleanerId,
      location,
      timestamp: new Date().toISOString()
    });
  }
}
