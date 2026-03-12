import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { getSupabaseClient } from '../storage/database/supabase-client';
import { CreateCleanerDto, UpdateCleanerDto, VerifyCleanerDto } from './dto/cleaners.dto';

@Injectable()
export class CleanersService {
  private readonly client = getSupabaseClient();

  async createCleaner(createCleanerDto: CreateCleanerDto) {
    const { data, error } = await this.client
      .from('cleaners')
      .insert({
        name: createCleanerDto.name,
        phone: createCleanerDto.phone,
        service_types: createCleanerDto.serviceTypes,
        latitude: createCleanerDto.latitude,
        longitude: createCleanerDto.longitude,
        is_online: true,
        is_verified: false,
        rating: 0.0,
        completed_orders: 0
      })
      .select()
      .single();

    if (error) {
      throw new ConflictException(`Failed to create cleaner: ${error.message}`);
    }

    return data;
  }

  async getAllCleaners(
    isVerified?: boolean,
    page: number = 1,
    pageSize: number = 20
  ) {
    let query = this.client
      .from('cleaners')
      .select('*')
      .order('created_at', { ascending: false });

    if (isVerified !== undefined) {
      query = query.eq('is_verified', isVerified);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    query = query.range(from, to);

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch cleaners: ${error.message}`);
    }

    return data || [];
  }

  async getCleanerById(id: number) {
    const { data, error } = await this.client
      .from('cleaners')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Cleaner not found`);
    }

    return data;
  }

  async updateCleaner(id: number, updateCleanerDto: UpdateCleanerDto) {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (updateCleanerDto.name) updateData.name = updateCleanerDto.name;
    if (updateCleanerDto.phone) updateData.phone = updateCleanerDto.phone;
    if (updateCleanerDto.serviceTypes) updateData.service_types = updateCleanerDto.serviceTypes;
    if (updateCleanerDto.latitude !== undefined) updateData.latitude = updateCleanerDto.latitude;
    if (updateCleanerDto.longitude !== undefined) updateData.longitude = updateCleanerDto.longitude;
    if (updateCleanerDto.isOnline !== undefined) updateData.is_online = updateCleanerDto.isOnline;

    const { data, error } = await this.client
      .from('cleaners')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundException(`Cleaner not found`);
    }

    return data;
  }

  async verifyCleaner(id: number, verifyCleanerDto: VerifyCleanerDto, adminId: number) {
    const { data, error } = await this.client
      .from('cleaners')
      .update({
        is_verified: verifyCleanerDto.isVerified,
        verified_by: adminId,
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundException(`Cleaner not found`);
    }

    return data;
  }

  async updateCleanerStatus(id: number, isOnline: boolean) {
    const { data, error } = await this.client
      .from('cleaners')
      .update({
        is_online: isOnline,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundException(`Cleaner not found`);
    }

    return data;
  }

  async getCleanerStats(id: number) {
    // 获取保洁员基本信息
    const { data: cleaner, error: cleanerError } = await this.client
      .from('cleaners')
      .select('*')
      .eq('id', id)
      .single();

    if (cleanerError || !cleaner) {
      throw new NotFoundException(`Cleaner not found`);
    }

    // 获取完成的订单数
    const { data: completedOrders, error: ordersError } = await this.client
      .from('cleaning_orders')
      .select('*')
      .eq('matched_cleaner_id', id)
      .eq('status', 'completed');

    // 获取进行中的订单数
    const { data: inProgressOrders, error: inProgressError } = await this.client
      .from('cleaning_orders')
      .select('*')
      .eq('matched_cleaner_id', id)
      .eq('status', 'in_progress');

    // 获取待接单的订单数
    const { data: pendingOrders, error: pendingError } = await this.client
      .from('cleaning_orders')
      .select('*')
      .eq('matched_cleaner_id', id)
      .eq('status', 'matched');

    return {
      cleaner,
      stats: {
        totalCompleted: completedOrders?.length || 0,
        totalInProgress: inProgressOrders?.length || 0,
        totalPending: pendingOrders?.length || 0,
        rating: cleaner.rating,
        completedOrders: cleaner.completed_orders
      }
    };
  }

  async deleteCleaner(id: number) {
    const { error } = await this.client
      .from('cleaners')
      .delete()
      .eq('id', id);

    if (error) {
      throw new NotFoundException(`Cleaner not found`);
    }

    return { success: true };
  }
}
