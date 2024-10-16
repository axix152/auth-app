import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // Validate user credentials
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    // Check if the user exists and the password matches
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...userWithoutPassword } = user.toObject(); // Remove password field
      return userWithoutPassword; // Return user object without the password
    }
    return null;
  }

  // Login function
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    // Validate the user's credentials
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials'); // Throw an exception if credentials are invalid
    }

    // Generate JWT payload with user details (you can add more fields if needed)
    const payload = { email: user.email, sub: user._id };

    // Return both the token and the user (without password)
    return {
      access_token: this.jwtService.sign(payload), // Generate JWT token
      user, // Return the user object without the password
    };
  }

  // signup function
  async signup(createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
