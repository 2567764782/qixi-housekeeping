import { SetMetadata } from '@nestjs/common';

/**
 * 角色装饰器
 * 用于标记需要特定角色的路由
 * @example
 * @Roles('admin', 'cleaner')
 * @Get()
 * async findAll() { ... }
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

/**
 * 权限装饰器
 * 用于标记需要特定权限的路由
 * @example
 * @Permissions({ resource: 'orders', action: 'create' })
 * @Post()
 * async create() { ... }
 */
export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (permissions: { resource: string; action: string }) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

/**
 * 公开装饰器
 * 用于标记不需要认证的路由
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
