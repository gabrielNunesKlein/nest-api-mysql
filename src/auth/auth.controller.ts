import { Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors, BadRequestException, UploadedFiles } from "@nestjs/common";
import { AuthLoginDto } from "./dto/auth-login-dto";
import { AuthRegisterDto } from "./dto/auth-register-dto";
import { AuthForgetDto } from "./dto/auth-forget-dto";
import { AuthResetDto } from "./dto/auth-reset-dto";
import { UserService } from "src/users/user.service";
import { AuthService } from "./auth.service";
import { AuthGuard } from "src/guards/auth.guard";
import { User } from "src/decoretors/user.decoretor";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { join } from "path";
import { FileService } from "src/file/file.service";

@Controller('auth')
export class AuthController {

    constructor(private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly fileService: FileService
        ){}

    @Post("login")
    async login(@Body() { email, password}: AuthLoginDto){
        return this.authService.login(email, password)
    }

    @Post('register')
    async register(@Body() body: AuthRegisterDto){
        return this.authService.register(body);
    }

    @Post('forget')
    async forget(@Body() {email}: AuthForgetDto){
        return this.authService.forget(email);
    }

    @Post('reset')
    async reset(@Body() { password, token}: AuthResetDto){
        this.authService.reset( password, token);
    }

    @UseGuards(AuthGuard)
    @Post('me')
    async me(@User() req){
        return { me: 'ok', data: req.tokenPayload, user: req.user }
    }

    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthGuard)
    @Post('photo')
    async photo(@User() user, @UploadedFile() photo: Express.Multer.File){

        const path = join(__dirname, '..', '..', 'storage', 'photos', `photo-${user.id}.png`)

       try {
        await this.fileService.upload(photo, path)
       } catch(error){
        throw new BadRequestException(error);
       }

        return { success: true }
    }

    @UseInterceptors(FilesInterceptor('files'))
    @UseGuards(AuthGuard)
    @Post('files')
    async uploadFiles(@User() user, @UploadedFiles() files: Express.Multer.File[]){
        return files;
    }
}
