import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { MessageModule } from '../messages/message.module';
import { RoomModule } from '../room/room.module';

@Module({
  providers: [GatewayService],
  imports: [MessageModule, RoomModule]
})
export class GatewayModule {
}


