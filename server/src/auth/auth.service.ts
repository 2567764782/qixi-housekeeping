import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { getSupabaseClient } from '../storage/database/supabase-client'
import { JwtBlacklistService } from './jwt-blacklist.service'

// 简单的内存验证码存储
const verificationCodes = new Map<string, { code: string; expireAt: number }>()

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
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
   * 发送验证码（模拟）
   */
  async sendVerificationCode(phone: string): Promise<{ success: boolean; code?: string }> {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    verificationCodes.set(phone, { code, expireAt: Date.now() + 5 * 60 * 1000 })
    console.log(`[SMS] 模拟发送验证码到 ${phone}: ${code}`)
    return { success: true, code }
  }

  /**
   * 验证验证码
   */
  async verifyCode(phone: string, code: string): Promise<boolean> {
    const stored = verificationCodes.get(phone)
    if (!stored) return false
    if (Date.now() > stored.expireAt) {
      verificationCodes.delete(phone)
      return false
    }
    const isValid = stored.code === code
    if (isValid) {
      verificationCodes.delete(phone)
    }
    return isValid
  }

  /**
   * 验证码登录
   */
  async loginWithCode(phone: string, code: string) {
    // 验证验证码
    const isValid = await this.verifyCode(phone, code)

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
