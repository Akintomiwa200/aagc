import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Inject, forwardRef } from '@nestjs/common';
import { PrayersService } from '../prayers/prayers.service';
import { EventsService } from '../events/events.service';
import { SermonsService } from '../sermons/sermons.service';
import { UsersService } from '../users/users.service';
import { DevotionalsService } from '../devotionals/devotionals.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/',
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AppGateway');
  private connectedClients = new Map<string, Socket>();

  constructor(
    @Inject(forwardRef(() => PrayersService))
    private readonly prayersService: PrayersService,
    @Inject(forwardRef(() => EventsService))
    private readonly eventsService: EventsService,
    @Inject(forwardRef(() => SermonsService))
    private readonly sermonsService: SermonsService,
    @Inject(forwardRef(() => DevotionalsService))
    private readonly devotionalsService: DevotionalsService,
    private readonly usersService: UsersService,
  ) { }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.connectedClients.set(client.id, client);

    // Send initial data
    this.sendInitialData(client);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  private async sendInitialData(client: Socket) {
    try {
      const [prayers, events, sermons, devotionals, stats] = await Promise.all([
        this.prayersService.findAll(),
        this.eventsService.findAll(),
        this.sermonsService.findAll(),
        this.devotionalsService.findAll('published'),
        this.prayersService.getStats(),
      ]);

      client.emit('initial-data', {
        prayers,
        events,
        sermons,
        devotionals,
        prayerStats: stats,
      });
    } catch (error) {
      this.logger.error('Error sending initial data:', error);
    }
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
    client.join(room);
    this.logger.log(`Client ${client.id} joined room: ${room}`);
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
    client.leave(room);
    this.logger.log(`Client ${client.id} left room: ${room}`);
  }

  // Prayer-related events
  async emitPrayerCreated(prayer: any) {
    const stats = await this.prayersService.getStats();
    this.server.emit('prayer-created', { prayer, stats });
  }

  async emitPrayerUpdated(prayer: any) {
    const stats = await this.prayersService.getStats();
    this.server.emit('prayer-updated', { prayer, stats });
  }

  async emitPrayerDeleted(prayerId: string) {
    const stats = await this.prayersService.getStats();
    this.server.emit('prayer-deleted', { prayerId, stats });
  }

  // Dashboard stats
  async emitDashboardUpdate(stats: any) {
    this.server.emit('dashboard-update', stats);
  }

  // Event-related events
  async emitEventCreated(event: any) {
    this.server.emit('event-created', event);
  }

  async emitEventUpdated(event: any) {
    this.server.emit('event-updated', event);
  }

  async emitEventDeleted(eventId: string) {
    this.server.emit('event-deleted', { eventId });
  }

  // Sermon-related events
  async emitSermonCreated(sermon: any) {
    this.server.emit('sermon-created', sermon);
  }

  async emitSermonUpdated(sermon: any) {
    this.server.emit('sermon-updated', sermon);
  }

  async emitSermonDeleted(sermonId: string) {
    this.server.emit('sermon-deleted', { sermonId });
  }

  // Member-related events
  async emitMemberCreated(member: any) {
    this.server.emit('member-created', member);
  }

  async emitMemberUpdated(member: any) {
    this.server.emit('member-updated', member);
  }

  async emitMemberDeleted(memberId: string) {
    this.server.emit('member-deleted', { memberId });
  }

  // Donation-related events
  async emitDonationCreated(donation: any) {
    this.server.emit('donation-created', donation);
  }

  async emitDonationUpdated(donation: any) {
    this.server.emit('donation-updated', donation);
  }

  // Devotional-related events
  async emitDevotionalCreated(devotional: any) {
    this.server.emit('devotional-created', devotional);
  }

  async emitDevotionalUpdated(devotional: any) {
    this.server.emit('devotional-updated', devotional);
  }

  async emitDevotionalDeleted(devotionalId: string) {
    this.server.emit('devotional-deleted', { devotionalId });
  }

  // Gallery-related events
  async emitGalleryImageCreated(image: any) {
    this.server.emit('gallery-image-created', image);
  }

  async emitGalleryImageUpdated(image: any) {
    this.server.emit('gallery-image-updated', image);
  }

  async emitGalleryImageDeleted(imageId: string) {
    this.server.emit('gallery-image-deleted', { imageId });
  }

  // Notification-related events
  async emitNotificationCreated(notification: any) {
    this.server.emit('notification-created', notification);
  }

  // Note-related events
  async emitNoteCreated(note: any) {
    this.server.emit('note-created', note);
  }

  async emitNoteUpdated(note: any) {
    this.server.emit('note-updated', note);
  }

  async emitNoteDeleted(noteId: string) {
    this.server.emit('note-deleted', { noteId });
  }

  // ConnectionCard-related events
  async emitConnectionCardCreated(card: any) {
    this.server.emit('connection-card-created', card);
  }

  // LiveStream-related events
  async emitLiveStreamUpdated(stream: any) {
    this.server.emit('livestream-updated', stream);
  }
}
