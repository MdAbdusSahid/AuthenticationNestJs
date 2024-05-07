import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { LocalStrategy } from "./stategy/local.strategy";
import { JwtStrategy } from "./stategy/jwt.strategy";


@Module({
    imports: [PassportModule, UserModule, JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
            secret: configService.get("JWT_Key"),
            signOptions: {
                expiresIn: configService.get<String>("JWT_EXPIRE") + "S"
            }
        })
    })],
    controllers: [AuthController],
    providers: [LocalStrategy, JwtStrategy]
})
export class AuthModule { }