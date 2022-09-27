import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { ChatGateway } from './chat/chat.gateway';
import { AtGuard } from './common/guards';
import { PrismaModule } from './prisma/prisma.module';
import { DrawingGateway } from './drawing/drawing.gateway';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    ChatGateway,
    DrawingGateway,
  ],
})
export class AppModule {}
