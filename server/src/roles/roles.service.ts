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

  /**
   * 创建角色
   */
  async createRole(name: string, description: string) {
    const { data, error } = await this.client
      .from('roles')
      .insert({
        name,
        description,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create role: ${error.message}`);
    }

    return data;
  }

  /**
   * 更新角色
   */
  async updateRole(id: number, updates: { name?: string; description?: string; is_active?: boolean }) {
    const { data, error } = await this.client
      .from('roles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update role: ${error.message}`);
    }

    return data;
  }

  /**
   * 删除角色
   */
  async deleteRole(id: number) {
    // 先删除角色权限关联
    await this.client
      .from('role_permissions')
      .delete()
      .eq('role_id', id);

    // 删除用户角色关联
    await this.client
      .from('user_roles')
      .delete()
      .eq('role_id', id);

    // 删除角色
    const { error } = await this.client
      .from('roles')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete role: ${error.message}`);
    }
  }

  /**
   * 为角色分配权限
   */
  async assignPermissionToRole(roleId: number, permissionId: number) {
    const { data, error } = await this.client
      .from('role_permissions')
      .insert({
        role_id: roleId,
        permission_id: permissionId
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to assign permission: ${error.message}`);
    }

    return data;
  }

  /**
   * 移除角色权限
   */
  async removePermissionFromRole(roleId: number, permissionId: number) {
    const { error } = await this.client
      .from('role_permissions')
      .delete()
      .eq('role_id', roleId)
      .eq('permission_id', permissionId);

    if (error) {
      throw new Error(`Failed to remove permission: ${error.message}`);
    }
  }

  /**
   * 获取所有权限
   */
  async getAllPermissions() {
    const { data, error } = await this.client
      .from('permissions')
      .select('*')
      .eq('is_active', true);

    if (error) {
      throw new Error(`Failed to get permissions: ${error.message}`);
    }

    return data || [];
  }

  /**
   * 创建权限
   */
  async createPermission(name: string, code: string, description: string, resource?: string, action?: string) {
    const { data, error } = await this.client
      .from('permissions')
      .insert({
        name,
        code,
        description,
        resource,
        action,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create permission: ${error.message}`);
    }

    return data;
  }

  /**
   * 更新权限
   */
  async updatePermission(id: number, updates: { name?: string; code?: string; description?: string; resource?: string; action?: string }) {
    const { data, error } = await this.client
      .from('permissions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update permission: ${error.message}`);
    }

    return data;
  }

  /**
   * 删除权限
   */
  async deletePermission(id: number) {
    // 先删除角色权限关联
    await this.client
      .from('role_permissions')
      .delete()
      .eq('permission_id', id);

    // 删除权限
    const { error } = await this.client
      .from('permissions')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete permission: ${error.message}`);
    }
  }
}
