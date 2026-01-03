import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DevotionalsController } from './devotionals.controller';
import { DevotionalsService } from './devotionals.service';
import { Devotional, DevotionalSchema } from './schemas/devotional.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Devotional.name, schema: DevotionalSchema },
    ]),
    CloudinaryModule,
  ],
  controllers: [DevotionalsController],
  providers: [DevotionalsService],
  exports: [DevotionalsService],
})
export class DevotionalsModule {}

