import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { getSupabaseClient } from '../storage/database/supabase-client'
import { JwtBlacklistService } from './jwt-blacklist.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly jwtBlacklistService: JwtBlacklistService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
      passReqToCallback: true,
    })
  }

  async validate(req: any, payload: any) {
    // 检查 token 是否在黑名单中
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req)

    if (token) {
      const isBlacklisted = await this.jwtBlacklistService.isBlacklisted(token)

      if (isBlacklisted) {
        throw new UnauthorizedException('Token 已失效')
      }
    }

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
