import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import config from './common/configs/config';
import { PrismaModule, loggingMiddleware } from 'nestjs-prisma';
import { ReadFileModule } from './read-file/read-file.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          loggingMiddleware({
            logger: new Logger('PrismaMiddleware'),
            logLevel: 'log',
          }),
        ],
      },
    }),
    ReadFileModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
