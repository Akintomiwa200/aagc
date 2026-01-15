import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';
import { Gallery, GallerySchema } from './schemas/gallery.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { WebSocketModule } from '../websocket/websocket.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Gallery.name, schema: GallerySchema }]),
        CloudinaryModule,
        forwardRef(() => WebSocketModule),
    ],
    controllers: [GalleryController],
    providers: [GalleryService],
    exports: [GalleryService],
})
export class GalleryModule { }
