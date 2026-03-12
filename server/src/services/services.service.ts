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
        price: '100元/次',
        icon: 'Sparkles'
      },
      {
        name: '深度保洁',
        description: '全面深度清洁，彻底清除污渍和死角',
        category: 'cleaning',
        price: '200元/次',
        icon: 'Sparkles'
      },
      {
        name: '厨房改造',
        description: '橱柜更换、水电改造、瓷砖翻新',
        category: 'renovation',
        price: '面议',
        icon: 'Wrench'
      },
      {
        name: '卫生间改造',
        description: '卫浴设施更换、防水处理、空间优化',
        category: 'renovation',
        price: '面议',
        icon: 'Wrench'
      },
      {
        name: '墙面刷新',
        description: '墙面修补、重新刷漆、色彩搭配',
        category: 'renovation',
        price: '50元/平米',
        icon: 'PaintBucket'
      },
      {
        name: '地板更换',
        description: '地板拆除、新地板铺设、踢脚线处理',
        category: 'renovation',
        price: '100元/平米',
        icon: 'Building2'
      }
    ]

    const { error } = await this.client.from('services').insert(services)

    if (error) {
      throw new Error(`Failed to seed services: ${error.message}`)
    }

    return { message: 'Services seeded successfully' }
  }
}
