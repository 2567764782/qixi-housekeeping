import { Injectable } from '@nestjs/common'
import { users } from '../storage/database/shared/schema'
import { eq } from 'drizzle-orm'
import { getSupabaseClient } from '../storage/database/supabase-client'

@Injectable()
export class UsersService {
  /**
   * 获取随机用户列表（用于轮播图展示）
   */
  async getRandomUsers(limit: number = 10) {
    const supabase = getSupabaseClient()

    // 随机获取用户，通过不同的排序方式来模拟随机
    const { data, error } = await supabase
      .from('users')
      .select('id, nickname, phone, gender, city, created_at')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(`获取用户列表失败: ${error.message}`)
    }

    // 打乱顺序以获得随机效果
    const shuffled = this.shuffleArray(data || [])

    return shuffled
  }

  /**
   * 根据城市获取用户列表
   */
  async getUsersByCity(city: string, limit: number = 10) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('users')
      .select('id, nickname, phone, gender, city, created_at')
      .eq('city', city)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(`获取城市用户列表失败: ${error.message}`)
    }

    return data || []
  }

  /**
   * 获取用户统计信息
   */
  async getUserStats() {
    const supabase = getSupabaseClient()

    // 获取总用户数
    const { count: totalUsers, error: countError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      throw new Error(`获取用户总数失败: ${countError.message}`)
    }

    // 获取性别分布
    const { data: genderData, error: genderError } = await supabase
      .from('users')
      .select('gender')

    if (genderError) {
      throw new Error(`获取性别分布失败: ${genderError.message}`)
    }

    const genderDistribution = (genderData || []).reduce((acc: any, user: any) => {
      acc[user.gender] = (acc[user.gender] || 0) + 1
      return acc
    }, {})

    // 获取城市分布
    const { data: cityData, error: cityError } = await supabase
      .from('users')
      .select('city')

    if (cityError) {
      throw new Error(`获取城市分布失败: ${cityError.message}`)
    }

    const cityDistribution = (cityData || []).reduce((acc: any, user: any) => {
      acc[user.city] = (acc[user.city] || 0) + 1
      return acc
    }, {})

    return {
      totalUsers: totalUsers || 0,
      genderDistribution,
      cityDistribution: Object.entries(cityDistribution)
        .sort(([, a]: any, [, b]: any) => b - a)
        .slice(0, 10)
        .reduce((acc: any, [city, count]) => {
          acc[city] = count
          return acc
        }, {}),
    }
  }

  /**
   * 打乱数组顺序
   */
  private shuffleArray(array: any[]): any[] {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }
}
