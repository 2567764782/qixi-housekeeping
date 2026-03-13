import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config'
import { getSupabaseClient } from '../storage/database/supabase-client'
import { SmsService } from '../sms/sms.service'
import { JwtBlacklistService } from './jwt-blacklist.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly smsService: SmsService,
    private readonly jwtBlacklistService: JwtBlacklistService,
  ) {}

  /**
   * 用户注册
   */
  async register(phone: string, password: string, nickname?: string) {
    const supabase = getSupabaseClient()

    // 检查手机号是否已存在
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single()

    if (existingUser && !checkError) {
      throw new ConflictException('该手机号已注册')
    }

    // 哈希密码
    const hashedPassword = await bcrypt.hash(password, 10)

    // 创建用户
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        phone,
        password: hashedPassword,
        nickname: nickname || `用户${phone.slice(-4)}`,
        role: 'user', // 默认角色
        created_at: new Date().toISOString(),
      })
      .select('id, phone, nickname, role, created_at')
      .single()

    if (createError) {
      throw new Error(`注册失败: ${createError.message}`)
    }

    // 生成 JWT token
    const payload = { sub: newUser.id, phone: newUser.phone, role: newUser.role }
    const token = this.jwtService.sign(payload)

    return {
      access_token: token,
      user: {
        id: newUser.id,
        phone: newUser.phone,
        nickname: newUser.nickname,
        role: newUser.role,
      },
    }
  }

  /**
   * 用户登录
   */
  async login(phone: string, password: string) {
    const supabase = getSupabaseClient()

    // 查找用户
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single()

    if (error || !user) {
      throw new UnauthorizedException('用户名或密码错误')
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误')
    }

    // 生成 JWT token
    const payload = { sub: user.id, phone: user.phone, role: user.role }
    const token = this.jwtService.sign(payload)

    return {
      access_token: token,
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        role: user.role,
      },
    }
  }

  /**
   * 验证用户
   */
  async validateUser(userId: string) {
    const supabase = getSupabaseClient()

    const { data: user, error } = await supabase
      .from('users')
      .select('id, phone, nickname, role')
      .eq('id', userId)
      .single()

    if (error || !user) {
      throw new UnauthorizedException('用户不存在')
    }

    return user
  }

  /**
   * 刷新 token
   */
  async refreshToken(userId: string) {
    const user = await this.validateUser(userId)

    const payload = { sub: user.id, phone: user.phone, role: user.role }
    const token = this.jwtService.sign(payload)

    return {
      access_token: token,
      user,
    }
  }

  /**
   * 验证码登录
   */
  async loginWithCode(phone: string, code: string) {
    // 验证验证码
    const isValid = await this.smsService.verifyCode(phone, code)

    if (!isValid) {
      throw new UnauthorizedException('验证码错误或已过期')
    }

    const supabase = getSupabaseClient()

    // 查找用户
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single()

    if (error || !user) {
      // 用户不存在，自动创建用户
      return await this.register(phone, '', `用户${phone.slice(-4)}`)
    }

    // 生成 JWT token
    const payload = { sub: user.id, phone: user.phone, role: user.role }
    const token = this.jwtService.sign(payload)

    return {
      access_token: token,
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        role: user.role,
      },
    }
  }

  /**
   * 将 token 加入黑名单
   */
  async addToBlacklist(token: string, expiresIn: number): Promise<void> {
    await this.jwtBlacklistService.addToBlacklist(token, expiresIn)
  }
}
