import { Injectable } from "@nestjs/common";
import { LoginDto, RegisterDto } from "./dto/auth.schema";

@Injectable()
export class AuthService {
    register(registerDto: RegisterDto) {
        console.log(registerDto);
        return "This action adds a new auth";
    }

    login(loginDto: LoginDto) {
        console.log(loginDto);
        return "This action adds a new auth";
    }

    logout() {
        return "This action adds a new auth";
    }
}
