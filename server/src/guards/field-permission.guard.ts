import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { FIELD_PERMISSION_KEY, FieldPermissionRequirement } from '../decorators/field-permission.decorator'
import { GetCurrentUser } from '../decorators/get-current-user.decorator'
import { getSupabaseClient } from '../storage/database/supabase-client'

@Injectable()
export class FieldPermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requirement = this.reflector.getAllAndOverride<FieldPermissionRequirement>(
      FIELD_PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    )

    // 如果没有字段权限要求，直接放行
    if (!requirement) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user) {
      throw new ForbiddenException('未登录')
    }

    // admin 角色拥有所有字段权限
    if (user.role === 'admin') {
      return true
    }

    return true
  }

  /**
   * 过滤响应数据，只保留允许的字段
   */
  static filterFields(data: any, allowedFields: string[]): any {
    if (!data || typeof data !== 'object') {
      return data
    }

    if (Array.isArray(data)) {
      return data.map(item => FieldPermissionGuard.filterFields(item, allowedFields))
    }

    const filtered: any = {}

    allowedFields.forEach(field => {
      if (field in data) {
        filtered[field] = data[field]
      }
    })

    return filtered
  }
}
