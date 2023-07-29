import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../../core/decorators/current.user.decorator';
import { User } from '../../../core/models/users/user.model';
import { UserService } from '../services/user.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private userService: UserService) {}

    @ApiOperation({ summary: 'Get users list' })
    @ApiResponse({
        status: 200,
        description: 'Array of users',
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getUsers(@CurrentUser() user: User) {
        const response = await this.userService.getUsers(user.id, []);
        return response;
    }

    @ApiOperation({ summary: 'Change user boss' })
    @ApiResponse({
        status: 200,
        description: 'True if success else error',
    })
    @ApiParam({
        name: 'id',
        description: 'User identifier whom to be changed',
        example: 'f1553f30-f533-4a21-9ca9-b3d118e241a5',
        required: true,
        type: String,
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Patch(':id/boss')
    async changeBoss(
        @CurrentUser() user: User,
        @Param('id', ParseUUIDPipe) subordinateId: string,
        @Body('bossId', ParseUUIDPipe) bossId: string,
    ) {
        const response = await this.userService.changeBoss(user, subordinateId, bossId);
        return response;
    }
}
