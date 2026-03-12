import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { UsersService } from '../users/users.service'
import { getSupabaseClient } from '../storage/database/supabase-client'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
    })
  }

  async validate(payload: any) {
    const supabase = getSupabaseClient()
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', payload.sub)
      .single()

    if (error || !user) {
      throw new UnauthorizedException('用户不存在')
    }

    // 不返回密码字段
    const { password, ...userWithoutPassword } = user

    return {
      userId: payload.sub,
      phone: payload.phone,
      role: payload.role,
      ...userWithoutPassword,
    }
  }
}
