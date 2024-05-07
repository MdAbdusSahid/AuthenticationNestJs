import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { TodoModule } from './todo/todo.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './auth/stategy/local.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, envFilePath: [".local.env"]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DATABASE_HOST"),
        port: configService.get<number>("DATABASE_PORT"),
        username: configService.get("DATABASE_USERNAME"),
        password: configService.get("DATABASE_PASSWORD"),
        synchronize: configService.get<boolean>("DATABASE_SYNC"),
        logging: configService.get<boolean>("DATABASE_LOGGING"),
        autoLoadEntities: true,
        database: configService.get("DATABASE_NAME"),
        entities: [__dirname + "/**/*.entity{.ts,.js}"]

      })
    }),
    UserModule,
    TodoModule,
    AuthModule,
    PassportModule
  ],
  controllers: [AppController],
  providers: [AppService, LocalStrategy],
})
export class AppModule { }
