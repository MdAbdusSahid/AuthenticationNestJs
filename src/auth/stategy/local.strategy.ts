import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService) {
        super({
            usernameField: 'email',
            passportField: 'passport'
        })
    }
    async validate(email: string, password: string): Promise<User> {
        const user: User = await this.userService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException("User not found: " + email);
        }
        if (user.password !== password) {
            throw new UnauthorizedException("Invalid password");
        }
        return user;
    }
}