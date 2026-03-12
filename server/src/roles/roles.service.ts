import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../storage/database/supabase-client';

@Injectable()
export class RolesService {
  private readonly client = getSupabaseClient();

  /**
   * 获取用户的所有角色
   */
  async getUserRoles(userId: number) {
    const { data, error } = await this.client
      .from('user_roles')
      .select(`
        role_id,
        roles!inner (*)
      `)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to get user roles: ${error.message}`);
    }

    return (data || []).map(item => item.roles);
  }

  /**
   * 获取用户的所有权限
   */
  async getUserPermissions(userId: number) {
    const { data, error } = await this.client
      .from('user_roles')
      .select(`
        role_id,
        roles!inner (
          role_permissions!inner (
            permission_id,
            permissions!inner (*)
          )
        )
      `)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to get user permissions: ${error.message}`);
    }

    const permissions: any[] = [];
    (data || []).forEach((userRole: any) => {
      if (userRole.roles && userRole.roles.role_permissions) {
        userRole.roles.role_permissions.forEach((rp: any) => {
          permissions.push(rp.permissions);
        });
      }
    });

    return permissions;
  }

  /**
   * 检查用户是否有指定权限
   */
  async hasPermission(userId: number, resource: string, action: string): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);
    return permissions.some(
      (p: any) => p.resource === resource && p.action === action
    );
  }

  /**
   * 检查用户是否有指定角色
   */
  async hasRole(userId: number, roleName: string): Promise<boolean> {
    const roles = await this.getUserRoles(userId);
    return roles.some((r: any) => r.name === roleName);
  }

  /**
   * 为用户分配角色
   */
  async assignRole(userId: number, roleName: string) {
    // 获取角色ID
    const { data: roleData, error: roleError } = await this.client
      .from('roles')
      .select('id')
      .eq('name', roleName)
      .single();

    if (roleError || !roleData) {
      throw new Error('Role not found');
    }

    // 分配角色
    const { data, error } = await this.client
      .from('user_roles')
      .insert({
        user_id: userId,
        role_id: roleData.id
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to assign role: ${error.message}`);
    }

    return data;
  }

  /**
   * 移除用户角色
   */
  async removeRole(userId: number, roleName: string) {
    // 获取角色ID
    const { data: roleData, error: roleError } = await this.client
      .from('roles')
      .select('id')
      .eq('name', roleName)
      .single();

    if (roleError || !roleData) {
      throw new Error('Role not found');
    }

    // 移除角色
    const { error } = await this.client
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role_id', roleData.id);

    if (error) {
      throw new Error(`Failed to remove role: ${error.message}`);
    }

    return { success: true };
  }

  /**
   * 获取所有角色
   */
  async getAllRoles() {
    const { data, error } = await this.client
      .from('roles')
      .select('*')
      .eq('is_active', true);

    if (error) {
      throw new Error(`Failed to get roles: ${error.message}`);
    }

    return data || [];
  }

  /**
   * 获取角色的所有权限
   */
  async getRolePermissions(roleId: number) {
    const { data, error } = await this.client
      .from('role_permissions')
      .select(`
        permission_id,
        permissions!inner (*)
      `)
      .eq('role_id', roleId);

    if (error) {
      throw new Error(`Failed to get role permissions: ${error.message}`);
    }

    return (data || []).map((item: any) => item.permissions);
  }
}
