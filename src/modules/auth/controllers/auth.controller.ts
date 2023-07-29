import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../core/decorators/current.user.decorator';
import { User } from '../../../core/models/users/user.model';
import { SignInDto } from '../dtos/sign.in.dto';
import { SignUpDto } from '../dtos/sign.up.dto';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: 'Sign in user' })
    @ApiResponse({
        status: 200,
        description: 'User record with auth token',
    })
    @UseGuards(AuthGuard('local'))
    @Post('signin')
    async signIn(@CurrentUser() user: User, @Body() credentials: SignInDto): Promise<{ user: User; token: string }> {
        return await this.authService.signIn(user);
    }

    @ApiOperation({ summary: 'Sign up user' })
    @ApiResponse({
        status: 200,
        description: 'Created user record and auth token',
    })
    @Post('signup')
    async signUp(@Body() user: SignUpDto): Promise<{ user: Omit<User, 'password'>; token: string }> {
        return await this.authService.signUp(user);
    }
}
