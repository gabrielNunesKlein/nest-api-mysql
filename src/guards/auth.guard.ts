import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
            private readonly authService: AuthService,
            private readonly userService: UserService
        ){ }

    async canActivate(context: ExecutionContext){
        const request = context.switchToHttp().getRequest();
        const { authorization } = request.headers;

        if(authorization == undefined){
            return false;
        }

        try {
            const data = this.authService.checkToken((authorization ?? '').split(' ')[1])

            if(!data){
                return false;
            }

            request.tokenPayload = data;
            request.user = await this.userService.show(data.id);

            return true;
        } catch(e){
            return false;
        }
    }

}