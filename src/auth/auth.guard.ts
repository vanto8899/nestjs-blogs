import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from 'express';
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector, // Inject Reflector
        private jwtService: JwtService, 
        private configService: ConfigService,
        @InjectRepository(User) private userRepository: Repository<User>
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const isPublic = this.reflector.getAllAndOverride<string[]>('isPublic', 
            [context.getHandler(),
             context.getClass(),
            ])
        // uncheck authentication
        if (isPublic) {
            return true; // If the route is public, bypass the guard
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('SECRET')
            })
            const user = await this.userRepository.findOneBy({ id: payload.id });
            request['user'] = user;   
            request['user_data'] = payload;
        } catch {
            throw new HttpException({
                status: 419,
                message: "Token expired"
            }, 419)
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization ? request.headers.authorization.split(' ') : [];

        return type === 'Bearer' ? token : undefined;
    }
}