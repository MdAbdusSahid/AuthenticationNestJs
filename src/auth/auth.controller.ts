import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { User } from '../user/entities/user.entity';
import { JwtService } from "@nestjs/jwt";
import { ApiTags } from "@nestjs/swagger";
import { LoginDto } from "./dto/login.dto";


@Controller('auth')
@ApiTags("Auth")
export class AuthController {
    constructor(private jwtService: JwtService) { }
    @Post('/login')
    @UseGuards(AuthGuard('local'))
    login(@Req() req, @Body() loginDto: LoginDto) {
        const user: User = req.user;
        const payload = {
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email, role: user.role
        }
        return { token: this.jwtService.sign(payload) }
    }
}