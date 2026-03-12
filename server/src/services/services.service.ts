import { Injectable } from '@nestjs/common'
import { getSupabaseClient } from '../storage/database/supabase-client'
import type { Service } from '../storage/database/shared/schema'

@Injectable()
export class ServicesService {
  private readonly client = getSupabaseClient()

  async findAll(): Promise<Service[]> {
    const { data, error } = await this.client
      .from('services')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch services: ${error.message}`)
    }

    return data || []
  }

  async seedData(): Promise<{ message: string }> {
    const services = [
      {
        name: '日常保洁',
        description: '家庭日常清洁，包括厨房、卫生间、客厅等',
        category: 'cleaning',
        price: '88元/次',
        icon: 'Sparkles'
      },
      {
        name: '深度保洁',
        description: '全面深度清洁，彻底清除污渍和死角',
        category: 'cleaning',
        price: '258元/次',
        icon: 'Sparkles'
      },
      {
        name: '厨房改造',
        description: '橱柜更换、水电改造、瓷砖翻新',
        category: 'renovation',
        price: '起价5000元',
        icon: 'Wrench'
      },
      {
        name: '卫生间改造',
        description: '卫浴设施更换、防水处理、空间优化',
        category: 'renovation',
        price: '起价8000元',
        icon: 'Wrench'
      },
      {
        name: '墙面刷新',
        description: '墙面修补、重新刷漆、色彩搭配',
        category: 'renovation',
        price: '35元/平米',
        icon: 'PaintBucket'
      },
      {
        name: '地板更换',
        description: '地板拆除、新地板铺设、踢脚线处理',
        category: 'renovation',
        price: '120元/平米',
        icon: 'Building2'
      }
    ]

    const { error } = await this.client.from('services').insert(services)

    if (error) {
      throw new Error(`Failed to seed services: ${error.message}`)
    }

    return { message: 'Services seeded successfully' }
  }

  async updatePrices(): Promise<{ message: string; updated: number }> {
    // 根据北京市场价格更新
    const priceUpdates = [
      { id: 1, name: '日常保洁', price: '88元/次' },
      { id: 2, name: '深度保洁', price: '258元/次' },
      { id: 3, name: '厨房改造', price: '起价5000元' },
      { id: 4, name: '卫生间改造', price: '起价8000元' },
      { id: 5, name: '墙面刷新', price: '35元/平米' },
      { id: 6, name: '地板更换', price: '120元/平米' }
    ]

    let updatedCount = 0
    for (const update of priceUpdates) {
      const { error } = await this.client
        .from('services')
        .update({ price: update.price })
        .eq('name', update.name)

      if (!error) {
        updatedCount++
      }
    }

    return { message: 'Prices updated successfully', updated: updatedCount }
  }
}
