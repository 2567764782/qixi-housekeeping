import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { REQUIRE_PERMISSION_KEY, PermissionRequirement } from '../decorators/require-permission.decorator'
import { GetCurrentUser } from '../decorators/get-current-user.decorator'
import { getSupabaseClient } from '../storage/database/supabase-client'

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requirement = this.reflector.getAllAndOverride<PermissionRequirement>(
      REQUIRE_PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    )

    // 如果没有权限要求，直接放行
    if (!requirement) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user) {
      throw new ForbiddenException('未登录')
    }

    // admin 角色拥有所有权限
    if (user.role === 'admin') {
      return true
    }

    // 检查用户是否有对应的权限
    const hasPermission = await this.checkUserPermission(
      user.userId,
      requirement.resource,
      requirement.action,
    )

    if (!hasPermission) {
      throw new ForbiddenException(`没有权限执行该操作：${requirement.resource}:${requirement.action}`)
    }

    return true
  }

  private async checkUserPermission(
    userId: string,
    resourceName: string,
    actionName: string,
  ): Promise<boolean> {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('permissions')
      .select(`
        id,
        resource:resources!inner(name),
        action:actions!inner(name),
        userRoles!inner(
          role:roles!inner(name),
          userId
        )
      `)
      .eq('userRoles.userId', userId)
      .eq('resource.name', resourceName)
      .eq('action.name', actionName)
      .single()

    return !!data && !error
  }
}
