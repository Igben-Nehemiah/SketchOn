import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt/dist';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async signupLocal(
    dto: AuthDto,
  ): Promise<Tokens> {
    try {
      const hash = await this.hashData(
        dto.password,
      );

      const newUser =
        await this.prisma.user.create({
          data: {
            email: dto.email,
            hash,
          },
        });

      const tokens = await this.getTokens(
        newUser.id,
        newUser.email,
      );

      await this.updateRtHash(
        newUser.id,
        tokens.refresh_token,
      );
      return tokens;
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Credentials taken',
          );
        }
        throw error;
      }
    }
  }

  async signinLocal(
    dto: AuthDto,
  ): Promise<Tokens> {
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

    if (!user) {
      throw new ForbiddenException(
        'Invalid credentials',
      );
    }

    const hashMatches = await bcrypt.compare(
      dto.password,
      user.hash,
    );

    if (!hashMatches) {
      throw new ForbiddenException(
        'Invalid credentials',
      );
    }

    const tokens = await this.getTokens(
      user.id,
      user.email,
    );
    await this.updateRtHash(
      user.id,
      tokens.refresh_token,
    );
    return tokens;
  }

  async logout(userId: number) {
    const user =
      await this.prisma.user.updateMany({
        where: {
          id: userId,
          hashedRt: {
            not: null,
          },
        },
        data: {
          hashedRt: null,
        },
      });
  }

  async refreshTokens(
    userId: number,
    rt: string,
  ): Promise<Tokens> {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

    if (!user || !user.hashedRt) {
      throw new ForbiddenException(
        'Access denied',
      );
    }

    const hashMatches = await bcrypt.compare(
      rt,
      user.hashedRt,
    );

    if (!hashMatches) {
      throw new ForbiddenException(
        'Invalid refresh token',
      );
    }

    const tokens = await this.getTokens(
      userId,
      user.email,
    );
    await this.updateRtHash(
      user.id,
      tokens.refresh_token,
    );

    return tokens;
  }

  async hashData(data: string) {
    return await bcrypt.hash(data, 10);
  }

  async getTokens(
    userId: number,
    email: string,
  ): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'at-secret',
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'rt-secret',
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await this.hashData(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }
}
