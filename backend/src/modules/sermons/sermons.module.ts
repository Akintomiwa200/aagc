import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SermonsController } from './sermons.controller';
import { SermonsService } from './sermons.service';
import { Sermon, SermonSchema } from './schemas/sermon.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Sermon.name, schema: SermonSchema }])],
  controllers: [SermonsController],
  providers: [SermonsService],
})
export class SermonsModule {}

