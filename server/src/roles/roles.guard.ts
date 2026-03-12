import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesService } from './roles.service';

/**
 * 角色守卫
 * 检查用户是否有指定角色
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rolesService: RolesService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 获取装饰器中定义的角色
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

    // 如果没有定义角色，则允许访问
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;

    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    // 检查用户是否拥有任意一个所需角色
    for (const role of requiredRoles) {
      const hasRole = await this.rolesService.hasRole(userId, role);
      if (hasRole) {
        return true;
      }
    }

    throw new ForbiddenException('Insufficient permissions');
  }
}

/**
 * 权限守卫
 * 检查用户是否有指定权限
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rolesService: RolesService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 获取装饰器中定义的权限
    const requiredPermissions = this.reflector.get<{
      resource: string;
      action: string;
    }>('permissions', context.getHandler());

    // 如果没有定义权限，则允许访问
    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;

    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    // 检查用户是否拥有所需权限
    const hasPermission = await this.rolesService.hasPermission(
      userId,
      requiredPermissions.resource,
      requiredPermissions.action
    );

    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
