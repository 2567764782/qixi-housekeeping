import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Reflector } from '@nestjs/core'
import { FIELD_PERMISSION_KEY, FieldPermissionRequirement } from '../decorators/field-permission.decorator'
import { FieldPermissionGuard } from '../guards/field-permission.guard'
import { getSupabaseClient } from '../storage/database/supabase-client'

@Injectable()
export class FieldPermissionInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const requirement = this.reflector.getAllAndOverride<FieldPermissionRequirement>(
      FIELD_PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    )

    // 如果没有字段权限要求，直接返回
    if (!requirement) {
      return next.handle()
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user

    // admin 角色不过滤字段
    if (user?.role === 'admin') {
      return next.handle()
    }

    return next.handle().pipe(
      map((data) => {
        // 过滤响应数据
        return FieldPermissionGuard.filterFields(data, requirement.allowedFields)
      }),
    )
  }
}
