import { SetMetadata } from '@nestjs/common'

export const FIELD_PERMISSION_KEY = 'fieldPermission'

export interface FieldPermissionRequirement {
  resource: string
  allowedFields: string[]
}

export const FieldPermission = (resource: string, allowedFields: string[]) =>
  SetMetadata(FIELD_PERMISSION_KEY, { resource, allowedFields })
