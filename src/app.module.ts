import { ExpressAdapter } from "@bull-board/express";
import { BullBoardModule } from "@bull-board/nestjs";
import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BasicAuthMiddleware } from "./bullmq.middleware";
import {
  AuthModule,
  ConnectionModule,
  DestinationModule,
  OrganizationModule,
  SourceModule,
  UserModule,
} from "./service";
import { JwtStrategy } from "./utils/guards";
import { JWTModule } from "./utils/jwt.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DATABASE_HOST"),
        port: +configService.get("DATABASE_PORT"),
        username: configService.get("DATABASE_USERNAME"),
        password: configService.get("DATABASE_PASSWORD"),
        database: configService.get("DATABASE_NAME"),
        entities: [`${__dirname}/**/*.entity{.ts,.js}`],
        migrations: [`${__dirname}/../db/migrations/*{.ts,.js}`],
        migrationsTableName: "migrations",
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get("REDIS_HOST"),
          port: +configService.get("REDIS_PORT"),
        },
      }),
      inject: [ConfigService],
    }),
    BullBoardModule.forRoot({
      route: "/queues",
      adapter: ExpressAdapter,
      middleware: BasicAuthMiddleware,
    }),
    JWTModule,
    AuthModule,
    UserModule,
    OrganizationModule,
    SourceModule,
    DestinationModule,
    ConnectionModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
