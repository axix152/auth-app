// src/user/user.service.ts
import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // Create a new user and hash the password before saving to the database
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, email } = createUserDto;

    // Check if the user already exists
    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      // Return a ConflictException if user already exists
      throw new ConflictException('User with this email already exists');
    }

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user instance
      const newUser = new this.userModel({
        username,
        password: hashedPassword, // Store the hashed password
        email,
      });

      return await newUser.save();
    } catch (error) {
      console.log(error);

      // Handle any other errors and return a 500 Internal Server Error
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  // Find a user by email
  async findByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).exec();
  }

  // Retrieve all users (for demonstration purposes)
  async findAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
