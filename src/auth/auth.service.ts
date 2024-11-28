import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async register(createUserDto: CreateUserDto) {
    const alreadyRegisteredUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (alreadyRegisteredUser) {
      throw new Error('Usuário com este e-mail já cadastrado');
    }

    const password_hash = await bcrypt.hash(createUserDto.password, 12);
    const user = new User({
      name: createUserDto.name,
      email: createUserDto.email,
      password_hash,
    });

    return await this.userRepository.save(user);
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new Error('E-mail e/ou senha incorretos');
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      throw new Error('E-mail e/ou senha incorretos');
    }

    await this.userRepository.update(user.id, { lastLogin: new Date() });
    return user;
  }
}
