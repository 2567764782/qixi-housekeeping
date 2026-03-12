import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('roles')
@UseGuards(RolesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * 获取所有角色
   */
  @Get()
  @Roles('admin')
  async getAllRoles() {
    const roles = await this.rolesService.getAllRoles();
    return {
      status: 'success',
      data: roles
    };
  }

  /**
   * 创建角色
   */
  @Post()
  @Roles('admin')
  async createRole(@Body() body: { name: string; description: string }) {
    const role = await this.rolesService.createRole(body.name, body.description);
    return {
      status: 'success',
      data: role
    };
  }

  /**
   * 更新角色
   */
  @Put(':id')
  @Roles('admin')
  async updateRole(
    @Param('id') id: number,
    @Body() body: { name?: string; description?: string; is_active?: boolean }
  ) {
    const role = await this.rolesService.updateRole(id, body);
    return {
      status: 'success',
      data: role
    };
  }

  /**
   * 删除角色
   */
  @Delete(':id')
  @Roles('admin')
  async deleteRole(@Param('id') id: number) {
    await this.rolesService.deleteRole(id);
    return {
      status: 'success',
      message: 'Role deleted successfully'
    };
  }

  /**
   * 获取角色的所有权限
   */
  @Get(':roleId/permissions')
  @Roles('admin')
  async getRolePermissions(@Param('roleId') roleId: number) {
    const permissions = await this.rolesService.getRolePermissions(roleId);
    return {
      status: 'success',
      data: permissions
    };
  }

  /**
   * 为角色分配权限
   */
  @Post(':roleId/permissions')
  @Roles('admin')
  async assignPermissionToRole(
    @Param('roleId') roleId: number,
    @Body() body: { permissionId: number }
  ) {
    const result = await this.rolesService.assignPermissionToRole(roleId, body.permissionId);
    return {
      status: 'success',
      data: result
    };
  }

  /**
   * 移除角色权限
   */
  @Delete(':roleId/permissions/:permissionId')
  @Roles('admin')
  async removePermissionFromRole(
    @Param('roleId') roleId: number,
    @Param('permissionId') permissionId: number
  ) {
    await this.rolesService.removePermissionFromRole(roleId, permissionId);
    return {
      status: 'success',
      message: 'Permission removed successfully'
    };
  }

  /**
   * 获取用户的所有角色
   */
  @Get('user/:userId')
  @Roles('admin')
  async getUserRoles(@Param('userId') userId: number) {
    const roles = await this.rolesService.getUserRoles(userId);
    return {
      status: 'success',
      data: roles
    };
  }

  /**
   * 为用户分配角色
   */
  @Post('user/:userId/roles')
  @Roles('admin')
  async assignRoleToUser(
    @Param('userId') userId: number,
    @Body() body: { roleName: string }
  ) {
    const result = await this.rolesService.assignRole(userId, body.roleName);
    return {
      status: 'success',
      data: result
    };
  }

  /**
   * 移除用户角色
   */
  @Delete('user/:userId/roles/:roleName')
  @Roles('admin')
  async removeRoleFromUser(
    @Param('userId') userId: number,
    @Param('roleName') roleName: string
  ) {
    const result = await this.rolesService.removeRole(userId, roleName);
    return {
      status: 'success',
      data: result
    };
  }

  /**
   * 获取用户的所有权限
   */
  @Get('user/:userId/permissions')
  @Roles('admin')
  async getUserPermissions(@Param('userId') userId: number) {
    const permissions = await this.rolesService.getUserPermissions(userId);
    return {
      status: 'success',
      data: permissions
    };
  }

  /**
   * 获取所有权限
   */
  @Get('permissions/all')
  @Roles('admin')
  async getAllPermissions() {
    const permissions = await this.rolesService.getAllPermissions();
    return {
      status: 'success',
      data: permissions
    };
  }

  /**
   * 创建权限
   */
  @Post('permissions')
  @Roles('admin')
  async createPermission(
    @Body() body: { name: string; code: string; description: string; resource?: string; action?: string }
  ) {
    const permission = await this.rolesService.createPermission(body.name, body.code, body.description, body.resource, body.action);
    return {
      status: 'success',
      data: permission
    };
  }

  /**
   * 更新权限
   */
  @Put('permissions/:id')
  @Roles('admin')
  async updatePermission(
    @Param('id') id: number,
    @Body() body: { name?: string; code?: string; description?: string; resource?: string; action?: string }
  ) {
    const permission = await this.rolesService.updatePermission(id, body);
    return {
      status: 'success',
      data: permission
    };
  }

  /**
   * 删除权限
   */
  @Delete('permissions/:id')
  @Roles('admin')
  async deletePermission(@Param('id') id: number) {
    await this.rolesService.deletePermission(id);
    return {
      status: 'success',
      message: 'Permission deleted successfully'
    };
  }
}
